import { createSettingModel } from 'shared/lib/creators/setting_model';

import { SearchSettingsFieldsKeys } from 'shared/constants/search_settings_fields/keys';

export const tailModel = createSettingModel({
  settingType: SearchSettingsFieldsKeys.Tail,
});
