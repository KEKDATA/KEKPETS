import React, { useMemo } from 'react';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { capitalizeFirstLetter } from 'shared/lib/capitalize/first_letter';

interface Props {
  date: string;
}

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
  timeZone: 'UTC',
};

export const DateInfo = ({ date }: Props) => {
  /**
   * example: Вторник, 16 марта 2021 г., 23:00:42
   */
  const formatDate = useMemo(() => {
    const parsedDate = new Date(date);
    return capitalizeFirstLetter(
      new Intl.DateTimeFormat('ru-RU', options).format(parsedDate),
    );
  }, [date]);

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <CalendarTodayIcon />
      </Grid>
      <Grid item>
        <Typography>{formatDate}</Typography>
      </Grid>
    </Grid>
  );
};
