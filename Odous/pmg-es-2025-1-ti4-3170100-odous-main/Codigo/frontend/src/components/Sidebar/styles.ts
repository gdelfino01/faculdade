import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  background-color: var(--sidebar-background);
  color: var(--sidebar-text);
`;

export const Sidebar = styled.div<{ open: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${({ open }) => (open ? "240px" : "80px")};
  transition: width 0.3s ease;
  background-color: var(--sidebar-background);
  color: var(--sidebar-text);
`;

export const Main = styled.main<{ open: boolean }>`
  margin-left: ${({ open }) => (open ? "240px" : "80px")};
  width: calc(100% - ${({ open }) => (open ? "240px" : "80px")});
  transition: margin-left 0.5s ease, width 0.3s ease;
  overflow-x: hidden;
  background-color: var(--background-color);
  color: var(--text-color);
`;

// Header - Logo
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 20px 8px;
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
`;

export const CompanyName = styled.span`
  margin-left: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--sidebar-text);
`;

// Tools
export const ActionsContainer = styled.div<{ open: boolean }>`
  display: flex;
  flex-direction: ${({ open }) => (open ? "row" : "column")};
  align-items: center;
  justify-content: center;
  padding: 16px;
  width: 100%;
  margin-top: auto;
  box-sizing: border-box;
`;

export const ActionButton = styled.button<{ open?: boolean }>`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ open }) => (open ? "0 8px" : "8px 0")};
  width: ${({ open }) => (open ? "auto" : "100%")};
  max-width: 48px;
  cursor: pointer;
  color: var(--sidebar-text);

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  &:hover {
    opacity: 0.7;
  }
`;

// Links
export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 20px;
`;

export const MenuItem = styled.button<{ open: boolean; active?: boolean }>`
  background: ${({ active }) => (active ? "var(--menu-hover)" : "transparent")};
  border: none;
  display: flex;
  align-items: center;
  justify-content: ${({ open }) => (open ? "flex-start" : "center")};
  width: 100%;
  padding: 12px 16px;
  cursor: pointer;
  color: var(--sidebar-text);
  transition: background 0.2s ease;

  &:hover {
    background: var(--menu-hover);
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  span {
    margin-left: 12px;
    font-size: 0.95rem;
    white-space: nowrap;
  }
`;

export const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 32px;
  box-sizing: border-box;
`;

export const SubMenuItem = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? "var(--menu-hover)" : "transparent")};
  border: none;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  cursor: pointer;
  color: var(--sidebar-text);
  transition: background 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: var(--menu-hover);
  }
`;

// Logout
export const LogoutContainer = styled.div<{ open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ open }) => (open ? "flex-start" : "center")};
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid var(--border-divider);
`;

export const LogoutButton = styled.button<{ open?: boolean }>`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: ${({ open }) => (open ? "flex-start" : "center")};
  width: ${({ open }) => (open ? "auto" : "100%")};
  max-width: 48px;
  cursor: pointer;
  color: var(--sidebar-text);

  span {
    margin-left: 8px;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  svg {
    font-size: 24px;
  }

  &:hover {
    opacity: 0.7;
  }
`;