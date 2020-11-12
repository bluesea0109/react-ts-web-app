import 'firebase/auth';
import _ from 'lodash';
import React from 'react';
import { CommonTable } from '../../../components';

interface TagsProps {
  tagTypes: Set<string>;
  onDeleteTagType: (tag: string) => void;
}

const TagsTable = ({ tagTypes, onDeleteTagType }: TagsProps) => {
  const columns = [{ title: 'Name', field: 'id' }];

  const tags = Array.from(tagTypes).map((tag) => ({ id: tag }));

  return (
    <CommonTable
      data={{
        columns,
        rowsData: tags,
      }}
      editable={{
        isDeleteable: true,
        onRowDelete: (tag) => onDeleteTagType(tag.id),
      }}
      localization={{
        nonRecordError: 'No Tags Found',
      }}
    />
  );
};

export default TagsTable;
