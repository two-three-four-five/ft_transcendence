class OffcanvasManager {
  static offcanvases = {};

  static initOffcanvas(id) {
    const element = document.getElementById(id);
    if (element) {
      return (
        bootstrap.Offcanvas.getInstance(element) ||
        new bootstrap.Offcanvas(element)
      );
    } else {
      return null;
    }
  }

  static show(id) {
    const offcanvas = OffcanvasManager.getOffcanvasInstance(id);
    if (offcanvas) {
      offcanvas.show();
    }
  }

  static hide(id) {
    const offcanvas = OffcanvasManager.getOffcanvasInstance(id);
    if (offcanvas) {
      offcanvas.hide();
    }
  }

  static getOffcanvasInstance(id) {
    if (!OffcanvasManager.offcanvases[id]) {
      OffcanvasManager.offcanvases[id] = OffcanvasManager.initOffcanvas(id);
    }
    return OffcanvasManager.offcanvases[id];
  }
}

export default OffcanvasManager;
