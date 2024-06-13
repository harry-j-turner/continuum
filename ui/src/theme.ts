import { defaultTheme, mergeTheme } from 'evergreen-ui';

const BACKGROUND = '#FFFFFF';
const PRIMARY = '#394e5c';
const SECONDARY = '#829EB0';

const GRAY = '#C5C5C5';
const TINT3 = '#D9E8E7';
const TINT4 = '#8CBAB7';

const ACCENT = '#F6AE2D';
const HIGHLIGHT = '#F2F2F2';
const DANGER = '#F67E7D';

const theme = mergeTheme(defaultTheme, {
  fontFamilies: {
    display: 'Manrope, sans-serif',
    ui: 'Manrope, sans-serif',
    mono: 'Manrope, sans-serif'
  },
  components: {
    Button: {
      appearances: {
        primary: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderShadow: 'none',
          boxShadow: 'none',
          opacity: 0.8,
          color: PRIMARY,
          fontWeight: '600',
          selectors: {
            _disabled: {
              backgroundColor: GRAY
            },
            _hover: {
              opacity: 1.0,
              transition: 'opacity 0.1s ease-in-out'
            },
            _active: {
              boxShadow: `none`
            }
          }
        },
        secondary: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          border: `1px solid ${BACKGROUND}`,
          color: BACKGROUND,
          fontWeight: '600',
          selectors: {
            _disabled: {
              backgroundColor: GRAY
            },
            _hover: {
              opacity: 0.9,
              transition: 'opacity 0.1s ease-in-out'
            },
            _active: {
              boxShadow: `none`
            }
          }
        }
      }
    },
    Input: {
      baseStyle: {
        backgroundColor: BACKGROUND,
        borderRadius: 4,
        borderWidth: 0,
        border: `none`
      },
      appearances: {
        default: {
          backgroundColor: BACKGROUND,
          borderRadius: 4,
          borderWidth: 0,
          border: `1px solid ${GRAY}`,
          boxShadow: 'none',
          selectors: {
            _focus: {
              border: `1px solid ${GRAY}`,
              boxShadow: `0 0 2px 2px ${SECONDARY}`
            }
          }
        }
      }
    },
    Select: {
      appearances: {
        default: {
          backgroundColor: BACKGROUND,
          borderRadius: 4,
          borderWidth: 0,
          border: `1px solid ${GRAY}`,
          boxShadow: 'none',
          selectors: {
            _focus: {
              border: `1px solid ${GRAY}`,
              boxShadow: `0 0 2px 2px ${SECONDARY}`
            }
          }
        }
      }
    },
    Card: {
      baseStyle: {
        borderRadius: 4
      }
    },
    Heading: {
      baseStyle: {
        color: PRIMARY
      }
    },
    TagInput: {
      baseStyle: {
        backgroundColor: 'transparent',
        borderRadius: 4,
        borderWidth: 0,
        width: '100%',
        border: 'none'
      },
      appearances: {
        default: {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 4,
          borderWidth: 0,
          border: 'none',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
          selectors: {
            _focused: {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              border: `none`,
              boxShadow: `none`
            }
          }
        }
      }
    },
    Tab: {
      baseStyle: {
        color: 'orange',
        fontWeight: '600',
        padding: 64,
        borderRadius: 4,
        marginRight: 8,
        userSelect: 'none'
      },
      appearances: {
        primary: {
          selectors: {
            _current: {
              color: PRIMARY,
              textDecoration: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              boxShadow: 'none',
              border: 'none',
              userSelect: 'none'
            },
            _focus: {
              boxShadow: `none`
            }
          }
        }
      }
    }
  },
  colors: {
    background: BACKGROUND,
    tint3: TINT3,
    tint4: TINT4,
    secondary: SECONDARY,
    primary: PRIMARY,
    accent: ACCENT,
    danger: DANGER,
    highlight: HIGHLIGHT
  }
});

export default theme;
