import { Pagination } from '@alifd/next';
import { PaginationProps } from '@alifd/next/types/pagination';

const Between = (paginationProps: PaginationProps) => {
  return (
    <div className="items-center justify-between sm:flex">
      <Pagination
        {...paginationProps}
        pageSizeSelector="dropdown"
        pageSizeList={[10, 20, 50, 100]}
        className="next-pagination-hide-pages"
      />

      <div className="mt-4 sm:mt-0">
        <Pagination shape="arrow-only" showJump={false} {...paginationProps} />
      </div>
    </div>
  );
};

const PaginationPlus = {
  Between,
};

export default PaginationPlus;
