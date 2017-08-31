var commands = {
    "drawing": {
        "moveTo": {
            "labelstub": "moveTo",
            "type": "function",
            "parameters": {
                "x": {
                    "type": "number",
                    "value": 10
                },
                "y": {
                    "type": "number",
                    "value": 10
                }
            }
        },
        "moveToRandom": {
            "labelstub": "moveToRandom",
            "type": "function",
            "parameters": {}
        },
        "moveBy": {
            "labelstub": "moveBy",
            "type": "function",
            "parameters": {
                "x": {
                    "type": "number",
                    "value": 20
                },
                "y": {
                    "type": "number",
                    "value": 0
                }
            }
        },
        "circle": {
            "labelstub": "circle",
            "type": "function",
            "parameters": {
                "radius": {
                    "type": "number",
                    "value": 10
                }
            }
        },
        "square": {
            "labelstub": "square",
            "type": "function",
            "parameters": {
                "size": {
                    "type": "number",
                    "value": 20
                }
            }
        },
        "background": {
            "labelstub": "background",
            "type": "function",
            "parameters": {
                "color": {
                    "type": "color",
                    "value": "#2b3035"
                }
            }
        },
        "line": {
            "labelstub": "lineTo",
            "type": "function",
            "parameters": {
                "startX": {
                    "type": "number",
                    "value": 10
                },
                "startY": {
                    "type": "number",
                    "value": 10
                },
                "endX": {
                    "type": "number",
                    "value": 110
                },
                "endY": {
                    "type": "number",
                    "value": 10
                }
            }
        }
    },
    "style": {
        "color": {
            "labelstub": "fillColor",
            "type": "function",
            "parameters": {
                "color": {
                    "type": "color",
                    "value": "#ffff00"
                }
            }
        },
        "opacity": {
            "labelstub": "opacity",
            "type": "function",
            "parameters": {
                "opacity": {
                    "type": "number",
                    "value": 0.9
                }
            }
        },
        "stroke": {
            "labelstub": "stroke",
            "type": "function",
            "parameters": {
                "thickness": {
                    "type": "number",
                    "value": 1
                },
                "color": {
                    "type": "color",
                    "value": "#ff00ff"
                }
            }
        },
    },
    "control": {
        "animate": {
            "labelstub": "function animate() {",
            "labelclose": "};",
            "type": "control"
        },
        "repeat": {
            "labelstub": "repeat",
            "parameters": {
                "repeats": {
                    "type": "number",
                    "value": 10
                },
                "do": {
                    "type": "function",
                    "value": "function() {"
                }
            },
            "labelclose": "});",
            "type": "control"
        }
    },
    "math": {
        "random": {
            "labelstub": "randomNumber",
            "type": "value",
            "parameters": {
                "from": {
                    "type": "number",
                    "value": 0
                },
                "to": {
                    "type": "number",
                    "value": 100
                }
            }
        }
    }
};
