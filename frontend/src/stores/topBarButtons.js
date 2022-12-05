import create from 'zustand';

export const useButtons = create((set) => ({
  buttons: {
    colorPicker: false,
    home: false,
    profile: false,
    logIn: false,
    logOut: false,
    help: false,
    settings: false,
    catalogBar: false,
  },
  setButtons: ({
    colorPicker = false,
    home = false,
    profile = false,
    logIn = false,
    logOut = false,
    help = false,
    settings = false,
    catalogBar = false,
  }) => set(() => ({
    buttons: {
      colorPicker,
      home,
      profile,
      logIn,
      logOut,
      help,
      settings,
      catalogBar,
    },
  })),
}));

export default useButtons;