import React from "react";
import DataTable from "react-data-table-component";

const CustomDataTable = ({ title, data, columns, pagination }) => {
  return (
    <div>
      <DataTable
        title={title}
        columns={columns}
        data={data}
        pagination={pagination}
      />
    </div>
  );
};

export default CustomDataTable;
