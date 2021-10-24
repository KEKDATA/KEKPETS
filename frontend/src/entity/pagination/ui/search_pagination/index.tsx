import React from 'react';

import MuiPagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { usePaginationColor } from '../lib/pagination_color';

interface Props {
  paginationCount: number;
  page: number;
  onChange: (selectedPage: number) => void;
}

export const SearchPagination = ({
  page,
  paginationCount,
  onChange,
}: Props) => {
  const color = usePaginationColor();

  if (!paginationCount) {
    return null;
  }

  const handleChange = (_, selectedPage: number) => {
    /**
     * Гвард если пользователь выберет такую же страницу повторно (ui позволяет)
     * То мы не выполняем дальнейшую логику по работе с апи и URL
     */
    if (page === selectedPage) {
      return;
    }

    onChange(selectedPage);
  };

  return (
    <Stack spacing={2} alignItems="center" padding={3}>
      <MuiPagination
        page={page}
        count={paginationCount}
        color={color}
        size="large"
        onChange={handleChange}
      />
    </Stack>
  );
};
