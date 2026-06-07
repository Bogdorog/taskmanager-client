import { useEffect, useState, useCallback, useRef } from "react";
import {
    Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, MenuItem, Stack, TextField, Typography,
    CircularProgress, Grid, IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { getTask, updateTask, deleteTask, getComments, addComment, deleteComment } from "@/api/taskApi";
import {
    getTaskAttachments,
    uploadTaskAttachment,
    deleteTaskAttachment,
    type AttachmentDto, uploadCommentAttachment
} from "@/api/attachmentApi";
import type {TaskDto, TaskPriority, TaskCommentDto, TaskStatus} from "@/types/task";
import { getApiErrorMessage } from "@/utils/apiError";
import { getTaskStatusLabel } from "@/utils/taskStatus.ts";

interface Props {
    open: boolean;
    taskId: number | null;
    onClose: () => void;
    onUpdated: () => void;
}

const priorityConfig: Record<TaskPriority, { label: string; color: "success" | "info" | "warning" | "error" }> = {
    LOW: { label: "Низкий", color: "success" },
    MEDIUM: { label: "Средний", color: "info" },
    HIGH: { label: "Высокий", color: "warning" },
    CRITICAL: { label: "Критический", color: "error" },
};

function isImageFile(fileName: string): boolean {
    const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return extensions.some(ext => fileName.toLowerCase().endsWith(ext));
}

function TaskDialog({ open, taskId, onClose, onUpdated }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [task, setTask] = useState<TaskDto | null>(null);
    const [comments, setComments] = useState<TaskCommentDto[]>([]);
    const [attachments, setAttachments] = useState<AttachmentDto[]>([]);
    const [commentFiles, setCommentFiles] = useState<File[]>([]);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState<string>("");
    const [assignedToId, setAssignedToId] = useState<number | string>("");
    const [users, setUsers] = useState<CompanyMembershipDto[]>([]);

    const [newCommentText, setNewCommentText] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    // Синхронизация полей формы при изменении объекта task
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description ?? "");
            setPriority(task.priority as TaskPriority);
            setDueDate(task.dueDate ? task.dueDate.substring(0, 16) : "");
            setStatus(task.status);
            setAssignedToId(task.assignedTo?.id ?? "");
        } else {
            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setDueDate("");
            setStatus("");
            setAssignedToId("");
            setCommentFiles([]);
        }
    }, [task]);

    const resetForm = useCallback(() => {
        if (!task) return;
        setTitle(task.title);
        setDescription(task.description ?? "");
        setPriority(task.priority as TaskPriority);
        setDueDate(task.dueDate ? task.dueDate.substring(0, 16) : "");
        // Сброс новых полей:
        setStatus(task.status);
        setAssignedToId(task.assignedTo?.id ?? "");

        setEditMode(false);
        setNewCommentText("");
        setError("");
        setCommentFiles([]);
    }, [task]);

    const loadTaskData = useCallback(async () => {
        if (!taskId) return;
        try {
            setError("");
            const taskData = await getTask(taskId);
            // Проверяем наличие компании в задаче, прежде чем запрашивать её пользователей
            const companyId = taskData?.companyId;
            // Массив промисов, которые выполнятся в любом случае
            const promises: [Promise<any>, Promise<any>, Promise<any>] = [
                getComments(taskId),
                getTaskAttachments(taskId),
                // Если companyId нет, возвращаем пустой массив вместо падения всего метода
                companyId ? getCompanyMembers(companyId) : Promise.resolve([])
            ];

            const [commentsData, attachmentsData, userData] = await Promise.all(promises);

            setTask(taskData);
            setComments(commentsData);
            setAttachments(Array.isArray(attachmentsData) ? attachmentsData : []);
            setUsers(userData);

            if (!companyId) {
                console.warn(`У задачи #${taskId} отсутствует companyId. Список пользователей не загружен.`);
            }
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    }, [taskId]);

    useEffect(() => {
        if (open && taskId) {
            setLoading(true);
            loadTaskData().finally(() => setLoading(false));
        } else {
            setTask(null);
            setComments([]);
            setAttachments([]);
            setEditMode(false);
            setError("");
        }
    }, [open, taskId, loadTaskData]);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!taskId || !e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        try {
            setUploadingFile(true);
            setError("");
            const uploadedAsset = await uploadTaskAttachment(taskId, file);
            setAttachments((prev) => [...prev, uploadedAsset]);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setUploadingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function handleDeleteAttachment(attachmentId: number) { // Тип изменен на number (Long)
        if (!window.confirm("Вы уверены, что хотите удалить этот файл?")) return;
        try {
            setError("");
            await deleteTaskAttachment(attachmentId);
            // Фильтруем стейт по id вложения
            setAttachments((prev) => prev.filter(a => a.id !== attachmentId));
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!task || !title.trim()) return;

        try {
            setSubmitting(true);
            setError("");
            const updated = await updateTask(task.id, {
                assignedToId: Number(assignedToId) || null,
                title: title.trim(),
                description: description.trim(),
                priority,
                dueDate: dueDate || null,
                status: status as TaskStatus,
            });
            setTask(updated);
            setEditMode(false);
            onUpdated();
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!task || !window.confirm("Вы уверены, что хотите окончательно удалить эту задачу?")) return;

        try {
            setSubmitting(true);
            setError("");
            await deleteTask(task.id);
            onUpdated();
            onClose();
        } catch (err) {
            setError(getApiErrorMessage(err));
            setSubmitting(false);
        }
    }

    async function handleCommentSubmit() {
        if (!task || !newCommentText.trim() || commentSubmitting) return;

        try {
            setCommentSubmitting(true);

            // Создаем сам текстовый комментарий
            const freshComment = await addComment(task.id, { text: newCommentText.trim() });

            // Если пользователь прикрепил файлы, загружаем их
            if (commentFiles.length > 0) {
                for (const fileToUpload of commentFiles) {
                    await uploadCommentAttachment(freshComment.id, fileToUpload);
                }
            }

            setComments((prev) => [...prev, freshComment]);
            setNewCommentText("");
            setCommentFiles([]);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setCommentSubmitting(false);
        }
    }

    async function handleDeleteComment(commentId: number) {
        if (!task || !window.confirm("Удалить этот комментарий?")) return;

        try {
            await deleteComment(task.id, commentId);
            setComments((prev) => prev.filter(c => c.id !== commentId));
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    }

    function handleClose() {
        resetForm();
        onClose();
    }

    function getInitials(fullName: string) {
        return fullName ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";
    }

    const currentPriority = task ? priorityConfig[task.priority as TaskPriority] : null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    component: editMode ? "form" : "div",
                    onSubmit: editMode ? handleSave : undefined,
                    sx: { borderRadius: 3, p: 1 }
                }
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem", pb: 1 }}>
                {editMode ? "Редактирование задачи" : `Задача #${taskId}`}
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "divider" }}>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress size={40} /></Box>
                ) : task ? (
                    <Grid container spacing={4}>

                        <Grid size={{ xs: 12, md: editMode ? 12 : 7 }}>
                            <Stack spacing={3} sx={{ pt: 1 }}>
                                {editMode ? (
                                    <>
                                        <TextField
                                            label="Название задачи"
                                            fullWidth
                                            required
                                            disabled={submitting}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />

                                        <TextField
                                            label="Описание"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            disabled={submitting}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />

                                        {/* ПЕРВЫЙ РЯД СЕЛЕКТОРОВ: ПРИОРИТЕТ И ДЕДЛАЙН */}
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    select
                                                    label="Приоритет"
                                                    fullWidth
                                                    disabled={submitting}
                                                    value={priority}
                                                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                                >
                                                    <MenuItem value="LOW">Низкий</MenuItem>
                                                    <MenuItem value="MEDIUM">Средний</MenuItem>
                                                    <MenuItem value="HIGH">Высокий</MenuItem>
                                                    <MenuItem value="CRITICAL">Критический</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Срок выполнения"
                                                    type="datetime-local"
                                                    fullWidth
                                                    disabled={submitting}
                                                    value={dueDate}
                                                    onChange={(e) => setDueDate(e.target.value)}
                                                    slotProps={{ inputLabel: { shrink: true } }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    select
                                                    label="Статус задачи"
                                                    fullWidth
                                                    disabled={submitting}
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                                >
                                                    <MenuItem value="BACKLOG">В ожидании</MenuItem>
                                                    <MenuItem value="IN_PROGRESS">В работе</MenuItem>
                                                    <MenuItem value="ON_REVIEW">На проверке</MenuItem>
                                                    <MenuItem value="DONE">Выполнено</MenuItem>
                                                    <MenuItem value="CANCELLED">Отменено</MenuItem>
                                                </TextField>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    select
                                                    label="Исполнитель"
                                                    fullWidth
                                                    disabled={submitting}
                                                    value={assignedToId}
                                                    onChange={(e) => setAssignedToId(e.target.value)}
                                                >
                                                    <MenuItem value=""><em>Не назначен</em></MenuItem>
                                                    {/* Маппим список пользователей системы */}
                                                    {users.map((u) => (
                                                        <MenuItem key={u.id} value={u.user.id}>
                                                            {u.user.fullName}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                                                {task.title}
                                            </Typography>
                                        </Box>

                                        {task.description ? (
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: "text.primary",
                                                    whiteSpace: "pre-line",
                                                    wordBreak: "break-word",
                                                    overflowWrap: "anywhere",
                                                    bgcolor: "rgba(0,0,0,0.01)",
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    height: "auto",
                                                    minHeight: "60px"
                                                }}
                                            >
                                                {task.description}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: "text.disabled", fontStyle: "italic" }}>
                                                Описание задачи не заполнено.
                                            </Typography>
                                        )}

                                        {/* Блок Вложений */}
                                        <Box>
                                            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                                                    Вложения ({attachments.length})
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    startIcon={uploadingFile ? <CircularProgress size={14} /> : <AttachFileIcon />}
                                                    disabled={uploadingFile}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    sx={{ textTransform: "none", borderRadius: 1.5 }}
                                                >
                                                    {uploadingFile ? "Загрузка..." : "Добавить"}
                                                </Button>
                                            </Stack>

                                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50", border: "1px dashed", borderColor: "divider" }}>
                                                {!Array.isArray(attachments) || attachments.length === 0 ? (
                                                    <Typography variant="caption" sx={{ color: "text.disabled", fontStyle: "italic", display: "block", textAlign: "center" }}>
                                                        Файлы не прикреплены
                                                    </Typography>
                                                ) : (
                                                    <Stack spacing={2}>
                                                        {/* СЕКЦИЯ КАРТИНОК */}
                                                        {attachments.some(att => isImageFile(att.media.fileName)) && (
                                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                                                {attachments.filter(att => isImageFile(att.media.fileName)).map((att) => {
                                                                    const file = att.media; // Для удобства выносим media
                                                                    return (
                                                            <Box
                                                                key={file.id}
                                                                sx={{
                                                                    position: "relative",
                                                                    width: 100,
                                                                    height: 100,
                                                                    borderRadius: 2,
                                                                    overflow: "hidden",
                                                                    border: "1px solid",
                                                                    borderColor: "divider",
                                                                    bgcolor: "black",
                                                                    "&:hover .image-overlay": { opacity: 1 }
                                                                }}
                                                            >
                                                                {/* Наш новый компонент с авторизацией */}
                                                                <SecureImage
                                                                    src={file.downloadUrl}
                                                                    alt={file.fileName}
                                                                    onClick={(computedSrc) => window.open(computedSrc, "_blank")}
                                                                />

                                                                <Box
                                                                    className="image-overlay"
                                                                    sx={{
                                                                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                                                        bgcolor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
                                                                        alignItems: "center", opacity: 0, transition: "opacity 0.2s",
                                                                        pointerEvents: "none"
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{ color: "white", pointerEvents: "auto" }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteAttachment(att.id); // Удаляем по id вложения
                                                                        }}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                                    );
                                                                })}
                                                            </Box>
                                                        )}

                                                        {/* СЕКЦИЯ ОСТАЛЬНЫХ ФАЙЛОВ */}
                                                        {attachments.some(att => !isImageFile(att.media.fileName)) && (
                                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                                {attachments.filter(att => !isImageFile(att.media.fileName)).map((att) => {
                                                                    const file = att.media;
                                                                    return (
                                                                        <Chip
                                                                            key={att.id}
                                                                            label={file.fileName}
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            icon={<FileDownloadIcon style={{ fontSize: 16 }} />}
                                                                            onClick={async () => {
                                                                                try {
                                                                                    // Скачиваем файл через Axios с токенами
                                                                                    const secureBlobUrl = await downloadProtectedFile(file.downloadUrl);

                                                                                    const link = document.createElement("a");
                                                                                    link.href = secureBlobUrl;
                                                                                    link.setAttribute("download", file.fileName);
                                                                                    document.body.appendChild(link);
                                                                                    link.click();

                                                                                    // Чистим за собой
                                                                                    link.remove();
                                                                                    URL.revokeObjectURL(secureBlobUrl);
                                                                                } catch (err) {
                                                                                    alert("Не удалось скачать файл. Ошибка авторизации.");
                                                                                    setError(getApiErrorMessage(err));
                                                                                }
                                                                            }}
                                                                            onDelete={() => handleDeleteAttachment(att.id)}
                                                                            sx={{
                                                                                borderRadius: 1.5,
                                                                                maxWidth: "240px",
                                                                                "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" }
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </Box>
                                                        )}

                                                    </Stack>
                                                )}
                                            </Box>
                                        </Box>

                                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                                            {currentPriority && (
                                                <Chip label={`Приоритет: ${currentPriority.label}`} color={currentPriority.color} sx={{ fontWeight: 600 }} />
                                            )}
                                            <Chip label={`Статус: ${getTaskStatusLabel(task.status)}`} variant="outlined" sx={{ fontWeight: 600 }} />
                                        </Stack>

                                        <Divider />

                                        <Grid container spacing={2} sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2.5, border: "1px solid", borderColor: "divider" }}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontWeight: 500 }}>Исполнитель</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                                    {task.assignedTo?.fullName ?? "Не назначен"}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontWeight: 500 }}>Автор создания</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                                    {task.createdBy?.fullName ?? "Система"}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontWeight: 500 }}>Дедлайн</Typography>
                                                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.5, color: task.dueDate ? "text.primary" : "text.disabled" }}>
                                                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "Не указан"}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </Stack>
                        </Grid>

                        {/* Рендерим колонку комментариев только если задача редактируется (уже существует) */}
                        {task?.id && !editMode ? (
                            <Grid size={{ xs: 12, md: 5 }} sx={{ borderLeft: { md: "1px solid" }, borderColor: { md: "divider" }, pl: { md: 3 } }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Обсуждение</Typography>

                                {/* Скрытый инпут для файлов комментария */}
                                <input
                                    type="file"
                                    id="comment-file-input"
                                    multiple // Позволим выбирать несколько файлов для комментария
                                    style={{ display: "none" }}
                                    onChange={async (e) => {
                                        if (!e.target.files || e.target.files.length === 0) return;
                                        // Сохраняем выбранные файлы локально в стейт перед отправкой комментария
                                        setCommentFiles(Array.from(e.target.files));
                                    }}
                                />

                                <Box sx={{ maxHeight: "320px", overflowY: "auto", pr: 1, mb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {comments.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: "text.disabled", fontStyle: "italic", textAlign: "center", py: 4 }}>
                                            Здесь пока нет комментариев. Станьте первым!
                                        </Typography>
                                    ) : (
                                        comments.map((comment) => (
                                            <CommentItem
                                                key={comment.id}
                                                comment={comment}
                                                onDeleteComment={handleDeleteComment}
                                                getInitials={getInitials}
                                                isImageFile={isImageFile}
                                                SecureImage={SecureImage} // Передаем ссылку на твой защищенный компонент картинок
                                            />
                                        ))
                                    )}
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {/* Форма создания комментария */}
                                <Box>
                                    {/* Список файлов, подготовленных к отправке */}
                                    {commentFiles.length > 0 && (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                                            {commentFiles.map((f, index) => (
                                                <Chip
                                                    key={index}
                                                    label={f.name}
                                                    size="small"
                                                    color="info"
                                                    onDelete={() => setCommentFiles(prev => prev.filter((_, i) => i !== index))}
                                                    sx={{ fontSize: '11px', borderRadius: 1 }}
                                                />
                                            ))}
                                        </Box>
                                    )}

                                    <TextField
                                        fullWidth
                                        multiline
                                        maxRows={3}
                                        size="small"
                                        placeholder="Напишите комментарий..."
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        disabled={commentSubmitting}

                                        // Позволяет отправлять комментарий по Enter (но Shift+Enter сделает перенос строки)
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault(); // Запрещаем перенос строки
                                                handleCommentSubmit(); // Выносим логику отправки в отдельную функцию
                                            }
                                        }}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                                        <IconButton
                                                            size="small"
                                                            color="secondary"
                                                            disabled={commentSubmitting}
                                                            onClick={() => document.getElementById("comment-file-input")?.click()}
                                                        >
                                                            <AttachFileIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                        <IconButton
                                                            color="primary"
                                                            disabled={(!newCommentText.trim() && commentFiles.length === 0) || commentSubmitting}
                                                            onClick={handleCommentSubmit} // Прямой вызов функции при клике
                                                        >
                                                            {commentSubmitting ? <CircularProgress size={20} /> : <SendIcon sx={{ fontSize: 18 }} />}
                                                        </IconButton>
                                                    </Stack>
                                                )
                                            }
                                        }}
                                    />
                                </Box>
                            </Grid>
                        ) : null}
                    </Grid>
                ) : (
                    <Typography color="text.secondary">Данные отсутствуют</Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, px: 3, justifyContent: "space-between" }}>
                <Box>
                    {task && (
                        <Button
                            color="error"
                            variant="text"
                            startIcon={<DeleteIcon />}
                            disabled={submitting || loading}
                            onClick={handleDelete}
                            sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                            Удалить задачу
                        </Button>
                    )}
                </Box>

                <Stack direction="row" spacing={1.5}>
                    {!editMode && task && (
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            disabled={loading}
                            onClick={() => setEditMode(true)}
                            sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                            Редактировать
                        </Button>
                    )}

                    {editMode && (
                        <>
                            <Button
                                variant="text"
                                disabled={submitting}
                                onClick={() => { resetForm(); setError(""); }}
                                sx={{ textTransform: "none", borderRadius: 2 }}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={submitting || !title.trim()}
                                sx={{ textTransform: "none", borderRadius: 2 }}
                            >
                                Сохранить
                            </Button>
                        </>
                    )}

                    {!editMode && (
                        <Button
                            variant="contained"
                            color="inherit"
                            startIcon={<CloseIcon />}
                            onClick={handleClose}
                            sx={{ textTransform: "none", borderRadius: 2, bgcolor: "grey.200", "&:hover": { bgcolor: "grey.300" }, boxShadow: "none" }}
                        >
                            Закрыть
                        </Button>
                    )}
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

export default TaskDialog;

import { downloadProtectedFile } from "@/api/attachmentApi";
import {CommentItem} from "@/components/task/CommentItem.tsx";
import {getCompanyMembers} from "@/api/companyApi.ts";
import type {CompanyMembershipDto} from "@/types/company.ts";

interface SecureImageProps {
    src: string;
    alt: string;
    onClick: (computedSrc: string) => void;
}

function SecureImage({ src, alt, onClick }: SecureImageProps) {
    const [blobUrl, setBlobUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        downloadProtectedFile(src)
            .then((url) => {
                if (isMounted) {
                    setBlobUrl(url);
                    setHasError(false);
                }
            })
            .catch(() => {
                if (isMounted) setHasError(true);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        // Очищаем память при размонтировании компонента
        return () => {
            isMounted = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [src]);

    if (loading) {
        return (
            <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "grey.200" }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    if (hasError) {
        return (
            <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "error.light", p: 1 }}>
                <Typography variant="caption" sx={{ color: "white", fontSize: '10px', textAlign: 'center' }}>Ошибка 401</Typography>
            </Box>
        );
    }

    return (
        <img
            src={blobUrl}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
            onClick={() => onClick(blobUrl)}
        />
    );
}