import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import * as Styled from "./styles";
import UserProfileModal from "../UserProfileModal";

import { useThemeContext } from "../../contexts/ThemeContext";

import Logo from "../../assets/img/OdousLogo.png";
import {
  Home,
  Package,
  Layers,
  CheckSquare,
  Users,
  User,
  Moon,
  Sun,
  LogOut,
  X,
  FileText,
  Info,
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [activePage, setActivePage] = useState("painel");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const theme = useTheme();
  const { theme: currentTheme, toggleTheme } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen((prev) => !prev);

  const drawerWidth = open ? 240 : 80;

  useEffect(() => {
    const currentPath = window.location.pathname.split("/")[1];
    setActivePage(currentPath);
  }, []);

  const handleMenuItemClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
      return;
    }

    if (item.path && item.path !== "#") {
      setActivePage(item.path.replace("/", ""));
      navigate(item.path);
    }
  };

  const sidebarSections = [
    {
      title: null,
      items: [{ name: "Painel", icon: <Home size={22} />, path: "/painel" }],
    },
    {
      title: "Materiais",
      dropdown: true,
      icon: <Package size={22} />,
      subItems: [
        { name: "Materiais", path: "/materials" },
        { name: "Lotes de Materiais", path: "/materials-lots" },
      ],
    },
    {
      title: "Semiacabados",
      dropdown: true,
      icon: <Layers size={22} />,
      subItems: [
        { name: "Semiacabados", path: "/semiacabados" },
        { name: "Lotes de Semiacabados", path: "/semiacabados-lots" },
        { name: "OP de Semiacabados", path: "/semiacabados-orders" },
      ],
    },
    {
      title: "Acabados",
      dropdown: true,
      icon: <CheckSquare size={22} />,
      subItems: [
        { name: "Acabados", path: "/acabados" },
        { name: "OP de Acabados", path: "/acabados-orders" },
        { name: "Lotes de Acabados", path: "/acabados-lots" },
      ],
    },
    {
      title: null,
      items: [
        {
          name: "Outros Cadastros",
          icon: <FileText size={22} />,
          path: "/outros-cadastros",
        },
        {
          name: "Usuários",
          icon: <Users size={22} />,
          path: "/users-management",
          role: "admin",
        },
      ],
    },
  ];

  return (
    <Styled.Container>
      <Drawer
        open={true}
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: "width 0.5s ease",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "width 0.5s ease",
            backgroundColor: "var(--sidebar-background)",
            color: "var(--sidebar-text)",
          },
        }}
      >
        {/* HEADER */}
        <Styled.Header style={{ position: "relative" }}>
          {!open ? (
            <Tooltip title="Abrir menu" placement="right">
              <Styled.Logo
                src={Logo}
                alt="Logo"
                onClick={!isMobile ? toggleDrawer : undefined}
                style={{ cursor: "pointer" }}
              />
            </Tooltip>
          ) : (
            <Styled.Logo src={Logo} alt="Logo" style={{ cursor: "default" }} />
          )}

          {open && (
            <IconButton
              onClick={toggleDrawer}
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                zIndex: 1,
              }}
              aria-label="Fechar sidebar"
            >
              <X size={22} />
            </IconButton>
          )}

          {open && !isMobile && (
            <Styled.CompanyName style={{ marginTop: 12 }}>
              Odous
            </Styled.CompanyName>
          )}
        </Styled.Header>

        {/* MENU */}
        <Styled.MenuContainer>
          {sidebarSections.map((section, idx) => (
            <React.Fragment key={idx}>
              {section.items &&
                section.items.map((item) => {
                  if (item.role && user?.role !== item.role) return null;
                  const isActive = activePage === item.path.replace("/", "");

                  return (
                    <Styled.MenuItem
                      key={item.name}
                      open={open}
                      active={isActive}
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {item.icon}
                      {open && <span>{item.name}</span>}
                    </Styled.MenuItem>
                  );
                })}

              {section.dropdown && (
                <>
                  <Styled.MenuItem
                    open={open}
                    active={false}
                    onClick={() => {
                      if (!open) {
                        setOpen(true);
                        setOpenDropdown(section.title); // Já abre o dropdown depois de abrir a sidebar
                      } else {
                        setOpenDropdown(
                          openDropdown === section.title ? null : section.title
                        );
                      }
                    }}
                  >
                    {section.icon}
                    {open && <span>{section.title}</span>}
                  </Styled.MenuItem>

                  {open && openDropdown === section.title && (
                    <Styled.SubMenu>
                      {section.subItems.map((sub) => {
                        const isActive =
                          activePage === sub.path.replace("/", "");
                        return (
                          <Styled.SubMenuItem
                            key={sub.name}
                            active={isActive}
                            onClick={() => handleMenuItemClick(sub)}
                          >
                            {sub.name}
                          </Styled.SubMenuItem>
                        );
                      })}
                    </Styled.SubMenu>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </Styled.MenuContainer>

        {/* AÇÕES FINAIS */}
        <Styled.ActionsContainer open={open}>
          <Tooltip title="Perfil" placement={open ? "top" : "right"}>
            <Styled.ActionButton onClick={() => setIsUserProfileOpen(true)}>
              <User size={22} />
            </Styled.ActionButton>
          </Tooltip>

          <Tooltip title="Info" placement={open ? "top" : "right"}>
            <Link
              to="/devs"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Styled.ActionButton>
                <Info size={22} />
              </Styled.ActionButton>
            </Link>
          </Tooltip>

          <Tooltip
            title={currentTheme === "dark" ? "Modo Claro" : "Modo Escuro"}
            placement={open ? "top" : "right"}
          >
            <Styled.ActionButton onClick={toggleTheme}>
              {currentTheme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
            </Styled.ActionButton>
          </Tooltip>
        </Styled.ActionsContainer>

        <Styled.LogoutContainer open={open}>
          <Tooltip title="Desconectar" placement="right">
            <Styled.LogoutButton
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              open={open}
            >
              <LogOut size={22} />
              {open && <span>Desconectar</span>}
            </Styled.LogoutButton>
          </Tooltip>
        </Styled.LogoutContainer>
      </Drawer>

      <Styled.Main open={open}>{children}</Styled.Main>

      <UserProfileModal
        open={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={user}
      />
    </Styled.Container>
  );
};

export default Sidebar;