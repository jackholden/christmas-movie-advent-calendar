class Panel {
  constructor() {}

  open() {
    this.panel.classList.add("show-panel");
  }
  close() {
    this.panel.classList.remove("show-panel");
  }
}

/*build custom panel class to use as modal in future version */

export default Panel;
