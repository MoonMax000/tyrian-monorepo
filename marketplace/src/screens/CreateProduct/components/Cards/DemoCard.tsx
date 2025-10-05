import React from 'react';
import Card from '../Card';
import UploadComponent from '../Upload';

const DemoCard: React.FC = () => {
    return (
        <Card hasOutline hasSwitch title="Demo">
            <UploadComponent title='Upload demo image or video'/>
        </Card>
    );
};

export default DemoCard;