import React from 'react';
import { Box } from '@mui/material';
import Category from '@/components/Category';
import { categoryBarHeight, componentColor } from '@/config/config';
import { topBarHeight } from 'src/config/config';

function CatalogBar({ sx = {}, ...args }) {
  const barHeight = categoryBarHeight - 1;

  return (
    <Box
      id="catalog_category_bar_container"
      data-testid="catalog_category_bar_container"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: '0.5em',
        px: '2em',
        position: 'absolute',
        top: `${topBarHeight}em`,
        left: 0,
        right: 0,
        maxHeight: `${barHeight}em`,
        boxShadow: 'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px',
        backgroundColor: `rgba(${componentColor.main})`,
        ...sx,
      }}
      {...args}
    >
      <Box
        id="catalog_category_bar"
        data-testid="catalog_category_bar"
        sx={{
          maxWidth: '80vw',
          width: 'max-content',
          height: 'max-content',
          display: 'flex',
          overflowX: 'auto',
          justifyContent: 'flex-start',
          alignItems: 'center',
          zIndex: '10',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <Category first category="Hello" />
        <Category category="Gear" />
        <Category category="Swords" />
        <Category category="Furniture" />
        <Category category="Open" />
        <Category category="Computers" />
        <Category category="Components" />
        <Category category="Wires" />
        <Category category="Hardware" />
        <Category category="Lighting" />
        <Category category="School" />
        <Category category="Textbooks" />
        <Category category="Food" />
        <Category last category="World" />
      </Box>
    </Box>
  );
}

export default CatalogBar;