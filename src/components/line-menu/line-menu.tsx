import React, { useEffect } from "react";

@import "./line-menu.scss";

interface LineMenuProps {
  isOpen: boolean;
  onClick: (open: boolean) => void;
}

const LineMenu = (props: LineMenuProps) => {
  const menuRef = React.useRef<HTMLDivElement>();

  useEffect(() => {
    if (menuRef.current) {
      const localOpen = menuRef.current.classList.contains("open");
      if (props.isOpen !== localOpen) {
        menuRef.current.classList.toggle("open");
      }
    }
  }, [props.isOpen]);

  const toggleOpen = () => {
    menuRef.current.classList.toggle("open");
    props.onClick(menuRef.current.classList.contains("open"));
  };

  return (
    <div className="sc-line-menu" ref={menuRef} onClick={toggleOpen}>
      <span className="sc-line-menu__top-bun"></span>
      <span className="sc-line-menu__bottom-bun"></span>
    </div>
  );
};

export default LineMenu;