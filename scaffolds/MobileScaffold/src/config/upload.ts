/* eslint-disable no-param-reassign */
import { UploadFieldProps } from '@alifd/meet/types/upload-field';
import { nanoid } from 'nanoid';

export const UploadFieldConfig: Omit<UploadFieldProps, 'name'> = {
  action: '',
  fileKeyName: 'file',
  beforeUpload: (files, options) => {
    return new Promise((resolve) => {
      const file = files.file as File & { tempUrl: string };

      const dataFormAjaxResponse = {
        host: 'goods-source-1257170569.cos.ap-guangzhou.myqcloud.com',
        domain: 'goods-source-1257170569.cos.ap-guangzhou.myqcloud.com',
        key: `goods/materials/${+new Date()}_${nanoid(6)}${file.name.substring(String(file.name).lastIndexOf('.'))}`,
      };
      const { host, key, domain } = dataFormAjaxResponse;
      options.action = `//${host}`;
      options.data = {
        key,
      };

      file.tempUrl = `//${domain}/${key}`;
      resolve(options);
    });
  },
  formatter: (res, file) => ({
    success: true,
    url: (file.file as File & { tempUrl: string }).tempUrl,
  }),
};
