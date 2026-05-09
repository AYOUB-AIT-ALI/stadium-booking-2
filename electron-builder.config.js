module.exports = {
  appId: 'com.stadium.booking.system',
  productName: 'Stadium Booking System',
  directories: {
    output: 'dist-installer',
  },
  files: [
    'dist/**/*',
    'prisma/**/*',
    'resources/**/*',
  ],
  asar: false,
  win: {
    target: 'nsis',
    icon: 'resources/icon.ico',
    certificateFile: null,
    certificatePassword: null,
  },
  mac: {
    target: 'dmg',
    icon: 'resources/icon.png',
  },
  linux: {
    target: 'AppImage',
    icon: 'resources/icon.png',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Stadium Booking System',
    installerIcon: 'resources/icon.ico',
    uninstallerIcon: 'resources/icon.ico',
    installerHeaderIcon: 'resources/icon.ico',
  },
};
