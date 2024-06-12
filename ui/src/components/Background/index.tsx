import React from 'react';
import { Pane } from 'evergreen-ui';

interface BackgroundProps {
  children: React.ReactNode;
}

function Background({ children }: BackgroundProps) {
  return (
    <Pane height="calc(100vh - 48px)" backgroundImage="url('mountain_background.png')" backgroundSize="cover">
      {children}
    </Pane>
  );
}

export default Background;
