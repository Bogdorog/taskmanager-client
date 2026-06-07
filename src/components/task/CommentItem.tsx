import { useEffect, useState } from "react";
import { Box, Stack, Avatar, Typography, Paper, IconButton, Chip, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getCommentAttachments, deleteCommentAttachment, downloadProtectedFile, type AttachmentDto } from "@/api/attachmentApi";
import type { TaskCommentDto } from "@/types/task";

interface CommentItemProps {
    comment: TaskCommentDto;
    onDeleteComment: (id: number) => void;
    // Вспомогательные функции, которые мы уже используем в TaskDialog
    getInitials: (name: string) => string;
    isImageFile: (name: string) => boolean;
    SecureImage: React.ComponentType<{ src: string; alt: string; onClick: (url: string) => void }>;
}

export function CommentItem({ comment, onDeleteComment, getInitials, isImageFile, SecureImage }: CommentItemProps) {
    const [attachments, setAttachments] = useState<AttachmentDto[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(false);

    // Загружаем файлы индивидуально для этого комментария
    useEffect(() => {
        let isMounted = true;
        setLoadingFiles(true);

        getCommentAttachments(comment.id)
            .then((data) => {
                if (isMounted) setAttachments(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Ошибка загрузки файлов комментария:", err))
            .finally(() => {
                if (isMounted) setLoadingFiles(false);
            });

        return () => { isMounted = false; };
    }, [comment.id]);

    return (
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: "background.paper", position: "relative" }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem", fontWeight: 600, bgcolor: "primary.main" }}>
                    {getInitials(comment.user?.fullName)}
                </Avatar>
                <Box sx={{ flexGrow: 1, pr: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "baseline", mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                            {comment.user?.fullName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.disabled" }}>
                            {new Date(comment.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "text.primary", whiteSpace: "pre-line", fontSize: "0.875rem", mb: 1 }}>
                        {comment.commentText}
                    </Typography>

                    {/* РЕНДЕР ОТЕЛЬНЫХ ВЛОЖЕНИЙ КОММЕНТАРИЯ */}
                    {loadingFiles ? (
                        <CircularProgress size={14} sx={{ mt: 1 }} />
                    ) : (
                        attachments.length > 0 && (
                            <Stack spacing={1} sx={{ mt: 1 }}>
                                {/* 1. Секция картинок */}
                                {attachments.some(att => isImageFile(att.media.fileName)) && (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                        {attachments.filter(att => isImageFile(att.media.fileName)).map((att) => (
                                            <Box
                                                key={att.id}
                                                sx={{
                                                    position: "relative", width: 60, height: 60, borderRadius: 1.5, overflow: "hidden",
                                                    border: "1px solid", borderColor: "divider", bgcolor: "black",
                                                    "&:hover .comm-img-overlay": { opacity: 1 }
                                                }}
                                            >
                                                <SecureImage
                                                    src={att.media.downloadUrl}
                                                    alt={att.media.fileName}
                                                    onClick={(src) => window.open(src, "_blank")}
                                                />
                                                <Box
                                                    className="comm-img-overlay"
                                                    sx={{
                                                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                                        bgcolor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", opacity: 0, transition: "opacity 0.2s"
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: "white" }}
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm("Удалить картинку из комментария?")) {
                                                                try {
                                                                    await deleteCommentAttachment(comment.id, att.media.id);
                                                                    setAttachments(prev => prev.filter(a => a.id !== att.id));
                                                                } catch {
                                                                    alert("Ошибка удаления файла");
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                {/* 2. Секция файлов */}
                                {attachments.some(att => !isImageFile(att.media.fileName)) && (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {attachments.filter(att => !isImageFile(att.media.fileName)).map((att) => (
                                            <Chip
                                                key={att.id}
                                                label={att.media.fileName}
                                                variant="outlined"
                                                size="small"
                                                icon={<FileDownloadIcon style={{ fontSize: 12 }} />}
                                                onClick={async () => {
                                                    try {
                                                        const url = await downloadProtectedFile(att.media.downloadUrl);
                                                        const link = document.createElement("a");
                                                        link.href = url;
                                                        link.setAttribute("download", att.media.fileName);
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        link.remove();
                                                        URL.revokeObjectURL(url);
                                                    } catch {
                                                        alert("Ошибка скачивания файла");
                                                    }
                                                }}
                                                onDelete={async () => {
                                                    if (window.confirm("Удалить файл?")) {
                                                        try {
                                                            await deleteCommentAttachment(comment.id, att.media.id);
                                                            setAttachments(prev => prev.filter(a => a.id !== att.id));
                                                        } catch {
                                                            alert("Ошибка удаления");
                                                        }
                                                    }
                                                }}
                                                sx={{ borderRadius: 1, fontSize: "0.75rem", maxWidth: "180px" }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Stack>
                        )
                    )}
                </Box>
            </Stack>

            <IconButton
                size="small"
                color="error"
                onClick={() => onDeleteComment(comment.id)}
                sx={{ position: "absolute", top: 4, right: 4, opacity: 0.6, "&:hover": { opacity: 1 } }}
            >
                <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
        </Paper>
    );
}