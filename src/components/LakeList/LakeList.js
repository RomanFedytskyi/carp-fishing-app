import React, { useContext } from 'react';
import { List, Button } from 'antd';
import { LakesContext } from '../../LakesContext';
import LakePreview from '../LakePreview/LakePreview';

import './LakeList.scss';

const LakeList = ({ onLakeSelect }) => {
  const { lakes } = useContext(LakesContext);

  const getLastNotes = (notes) => {
    return notes
      .filter((note) => note.type === 'fishBite')
      .slice(-3)
      .map(
        (note) => `Bait: ${note.fishBite.bait}, Distance: ${note.fishBite.distance}m`
      )
      .join(' | ');
  };

  return (
    <div className="lake-list">
      <h2>Lakes</h2>
      <List
        itemLayout="horizontal"
        dataSource={lakes}
        renderItem={(lake, index) => (
          <List.Item
            className="lake-list-item"
            onClick={() => onLakeSelect(index)}
          >
            <div className="lake-info">
              <List.Item.Meta title={lake.name} description={lake.description} />
              <div className="lake-notes">{getLastNotes(lake.notes)}</div>
            </div>
            <LakePreview lake={lake} className="lake-preview" />
          </List.Item>
        )}
      />
      <Button type="primary" onClick={() => onLakeSelect(null)}>
        Add Lake
      </Button>
    </div>
  );
};

export default LakeList;
