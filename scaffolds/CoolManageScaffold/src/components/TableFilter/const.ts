export enum EFilterCommand {
  EQUAL = '$eq',
  NOT_EQUAL = '$ne',
  CONTAINS = '$contains',
  NOT_CONTAINS = '$notContains',
  GREAT_THAN = '$gt',
  GREAT_THAN_OR_EQUAL = '$gte',
  LESS_THAN = '$lt',
  LESS_THAN_OR_EQUAL = '$lte',
}
export const FILTER_COMMANDS = [
  {
    label: '等于',
    value: EFilterCommand.EQUAL,
  },
  {
    label: '不等于',
    value: EFilterCommand.NOT_EQUAL,
  },
  {
    label: '包含',
    value: EFilterCommand.CONTAINS,
  },
  {
    label: '不包含',
    value: EFilterCommand.NOT_CONTAINS,
  },
  {
    label: '大于',
    value: EFilterCommand.GREAT_THAN,
  },
  {
    label: '大于等于',
    value: EFilterCommand.GREAT_THAN_OR_EQUAL,
  },
  {
    label: '小于',
    value: EFilterCommand.LESS_THAN,
  },
  {
    label: '小于等于',
    value: EFilterCommand.LESS_THAN_OR_EQUAL,
  },
];
