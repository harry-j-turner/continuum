import React from 'react';
import { Pane, Strong, Icon, IconComponent, Popover, Menu, Position, HomeIcon, MenuIcon } from 'evergreen-ui';
import theme from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';

export type HeaderLink = {
  name: string;
  icon: IconComponent;
  disabled?: boolean;
  onClick: () => unknown;
};

interface HeaderProps {
  links: HeaderLink[];
}

export function Header({ links }: HeaderProps) {
  const _links: React.ReactNode[] = [];
  const {isMobile} = useResponsive();

  if (isMobile) {
    _links.push(
      <Popover
        position={Position.BOTTOM_RIGHT}
        content={({ close }) => (
          <Menu>
            <Menu.Group>
              {links.map((link) => (
                <Menu.Item
                  userSelect="none"
                  key={link.name}
                  icon={link.icon}
                  onSelect={() => {
                    link.onClick();
                    close();
                  }}
                  disabled={link.disabled}
                  cursor={link.disabled ? null : 'pointer'}
                >
                  {link.name}
                </Menu.Item>
              ))}
            </Menu.Group>
          </Menu>
        )}
      >
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginLeft={32}
          cursor="pointer"
          userSelect="none"
        >
          <Icon icon={MenuIcon} color={theme.colors.background} size={16} marginRight={8} />
        </Pane>
      </Popover>
    );
  }

  if (!isMobile) {
    links.forEach((link) => {
      _links.push(
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginLeft={32}
          key={link.name}
          cursor="pointer"
          userSelect="none"
          pointerEvents={link.disabled ? 'none' : 'auto'}
          opacity={link.disabled ? 0.5 : 1}
          onClick={link.disabled ? () => null : link.onClick}
        >
          <Icon icon={link.icon} color={theme.colors.background} size={16} marginRight={8} />
          <Strong color={theme.colors.background}>{link.name}</Strong>
        </Pane>
      );       
    });
  }

  return (
    <Pane
      width="100%"
      height={48}
      backgroundColor={theme.colors.primary}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      userSelect="none"
    >
      <Pane display="flex" flexDirection="row" paddingLeft={16} alignItems="center">
        <img src="continuum_logo_white.png" alt="Logo" width={32} height={32} />
        <Strong color={theme.colors.background} marginLeft={8} fontFamily="Oxygen" fontSize={20}>
          Continuum
        </Strong>
      </Pane>
      <Pane display="flex" flexDirection="row" backgroundColor={theme.colors.primary} height={48} paddingRight={16}>
        {_links}
      </Pane>
    </Pane>
  );
}
