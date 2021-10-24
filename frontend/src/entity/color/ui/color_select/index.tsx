import React from 'react';

import { useIsMobile } from 'shared/lib/screen_type/is_mobile';

import { searchSettingsOptionsMocks } from 'shared/mocks/search_settings_options';

import { NativeSelect } from 'shared/ui/native_select';
import { Select } from 'shared/ui/select';

import { SearchSettingsFieldsTranslates } from 'shared/constants/search_settings_fields/translates';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const ColorSelect = ({ value, onChange }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <NativeSelect
        value={value}
        label={SearchSettingsFieldsTranslates.Color}
        onChangeValue={onChange}
        items={searchSettingsOptionsMocks.colors}
      />
    );
  }

  return (
    <Select
      value={value}
      label={SearchSettingsFieldsTranslates.Color}
      onChangeValue={onChange}
      items={searchSettingsOptionsMocks.colors}
    />
  );
};
