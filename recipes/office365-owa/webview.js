function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const _path = _interopRequireDefault(require('path'));

module.exports = (Ferdium, settings) => {
  const collectCounts = (selector, index=0) => {
    let unreadCount = 0;
    const foldersElement = document.querySelectorAll(selector)[index];
    if (foldersElement) {
      const allScreenReaders = foldersElement.querySelectorAll(
        'div[role=treeitem] > span:last-child span.screenReaderOnly'
      );
      for (const child of allScreenReaders) {
        if (child.previousSibling) {
          unreadCount += Ferdium.safeParseInt(
            child.previousSibling.textContent,
          );
        }
      }
    }
    return unreadCount;
  };

  const getMessages = () => {
    let directUnreadCount = 0;
    let indirectUnreadCount = 0;
    if (/\/owa/.test(location.pathname)) {
      // classic app
      directUnreadCount = Ferdium.safeParseInt(
        document.querySelectorAll("span[title*='Inbox'] + div > span")[0]
          ?.textContent,
      );
    } else {
      // new app
      directUnreadCount =
        settings.onlyShowFavoritesInUnreadCount === true
          ? collectCounts('div[role=tree] div[role=group]', 0)
          : collectCounts('div[role=tree] div[role=group]', 1);

      indirectUnreadCount = collectCounts('div[role=tree]:nth-child(4)'); // groups
    }

    Ferdium.setBadge(directUnreadCount, indirectUnreadCount);
  };
  Ferdium.loop(getMessages);

  Ferdium.injectCSS(_path.default.join(__dirname, 'service.css'));
};
