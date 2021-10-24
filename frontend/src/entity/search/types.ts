import { SearchSettingsFieldsKeys } from 'shared/constants/search_settings_fields/keys';

export interface SearchSettingsFormUrl {
  [SearchSettingsFieldsKeys.Type]?: {
    key: SearchSettingsFieldsKeys.Type;
    value: string;
    text: string;
  };
  [SearchSettingsFieldsKeys.Tail]?: {
    key: SearchSettingsFieldsKeys.Tail;
    value: string;
    text: string;
  };
  [SearchSettingsFieldsKeys.Color]?: {
    key: SearchSettingsFieldsKeys.Color;
    value: string;
    text: string;
  };
  [SearchSettingsFieldsKeys.Breed]?: {
    key: SearchSettingsFieldsKeys.Breed;
    value: string;
    text: string;
  };
}
