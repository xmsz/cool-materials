import useLocalHistory from '@/hooks/useLocalHistory';
import { Search } from '@alifd/next';
import { SearchProps } from '@alifd/next/types/search';
import { useState, useEffect, useMemo } from 'react';

const KeywordSearch = ({ onSubmit }: { onSubmit?: (keyword?: string) => void }) => {
  const [keyword, setKeyword] = useState<string>();
  const [curKeyword, setCurKeyword] = useState<string>();

  const [searchHistory, { put: putSearchHistory, remove: removeSearchHistory }] =
    useLocalHistory('search/searchHistory');

  useEffect(() => {
    // STEP: 记录导本地
    putSearchHistory({ label: curKeyword, value: curKeyword });
  }, [curKeyword]);

  const searchProps = useMemo<SearchProps>(() => {
    return {
      type: 'primary',
      value: keyword,
      onChange: (value, actionType, item) => {
        setKeyword(value);

        if (['itemClick', 'enter'].includes(actionType) || ['clear'].includes(item)) {
          setCurKeyword(value);
          onSubmit?.(value);
        }
      },
      buttonProps: {
        onClickCapture: () => {
          setCurKeyword(keyword);
          onSubmit?.(keyword);
        },
      },
      dataSource: searchHistory.map((item) => ({
        ...item,
        label: (
          <div className="flex items-center justify-between">
            {item.label}
            <i
              className="ic-round md-delete_outline text-gray-300 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                removeSearchHistory({ value: item.value });
              }}
            />
          </div>
        ),
      })),
      hasClear: true,
      autoHighlightFirstItem: false,
    };
  }, [searchHistory, keyword]);

  return <Search {...searchProps} />;
};

export default KeywordSearch;
