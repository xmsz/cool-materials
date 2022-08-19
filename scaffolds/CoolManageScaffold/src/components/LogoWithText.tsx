const Logo = ({
  hideText,
  ...props
}: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { hideText?: boolean }) => {
  return (
    <div className="items-center flex gap-2 text-base text-gray-900 flex-shrink-0">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDciIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCBmaWxsPSIjMDM0RUYwIiB3aWR0aD0iNDciIGhlaWdodD0iNDciIHJ4PSI3Ii8+PHBhdGggZmlsbC1vcGFjaXR5PSIuMTUxIiBmaWxsPSIjODdEMEYzIiBkPSJNMTEuMzM3IDExLjIyIDI0IDQ3LjIyaDIzbC02LjY4My0zNnoiLz48cGF0aCBkPSJtMjYuNDU3IDM5LjAzLjU2Ny01LjcxNUg4Ljg4bDIuNDU3LTIyLjA5NWgyOC45OEwzOS4xMiAyMS43OThIMjguNjYybC4xODktMi4zODhoLTcuMjQ1bC0uNjMgNS43MTVoMTcuNTc3bC0xLjI2IDE2LjM4Yy0uMjk0IDEuNjQ5LS45NjYgMy4wMTQtMi4wMTYgNC4wOTQtMS4wNSAxLjA4LTIuMTg0IDEuNjIxLTMuNDAyIDEuNjIxSDcuNjgzTDguODggMzUuNzg5bDEuODI3IDMuMjQxaDE1Ljc1WiIgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPg=="
        {...props}
      />
      {!hideText && <b className="flex-shrink-0">小猪ERP</b>}
    </div>
  );
};

export default Logo;
