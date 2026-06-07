import {
    createTheme,
} from "@mui/material/styles";

const theme = createTheme({

    palette: {

        mode: "light",

        primary: {
            main: "#7FBF90",
            light: "#A8D5B5",
            dark: "#5FA36F",
        },
        secondary: {
            main: "#CFE8D5",
        },

        background: {
            default: "#F8FCF8",
            paper: "#FFFFFF",
        },

        success: {
            main: "#66BB6A",
        },
    },

    shape: {
        borderRadius: 10,
    },

    typography: {

        fontFamily:
            "Inter, Roboto, sans-serif",

        h4: {
            fontWeight: 700,
            fontSize: "1.6rem",
        },

        h5: {
            fontWeight: 700,
            fontSize: "1.2rem",
        },

        h6: {
            fontWeight: 600,
            fontSize: "1rem",
        },

        body1: {
            fontSize: "0.9rem",
        },

        body2: {
            fontSize: "0.8rem",
        },
    },

    components: {

        MuiPaper: {

            styleOverrides: {

                root: {

                    boxShadow:
                        "0 1px 4px rgba(0,0,0,0.05)",

                    border: "1px solid #E7F2E9",
                },
            },
        },

        MuiButton: {

            defaultProps: {
                size: "small",
            },

            styleOverrides: {

                root: {

                    textTransform: "none",

                    borderRadius: 8,

                    fontWeight: 600,
                },
            },
        },

        MuiCard: {

            styleOverrides: {

                root: {

                    border: "1px solid #E7F2E9",

                    boxShadow: "none",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#F8FCF8",
                },
                "#root": {
                    minHeight: "100vh",
                    width: "100%",
                },
            },
        },
    },
});

export default theme;