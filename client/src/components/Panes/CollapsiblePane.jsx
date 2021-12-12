import { FC } from 'react';
import { SplitPane } from 'react-collapse-pane';
import styles from './CollapsiblePane.module.scss';

// interface Props {
//     orientation: 'vertical' | 'horizontal';
//     collapseDirection: 'left' | 'right';
//     minSize: number;
//     hasTopGutter: boolean;
//     children: React.ReactNode;
// }

const CollapsiblePane = ({
    orientation,
    collapseDirection = 'left',
    minSize = 0,
    hasTopGutter = false,
    children,
}) => {
    return (
        <SplitPane
            className={`${styles.pane} ${
                orientation === 'vertical' ? styles.vertical : styles.horizontal
            } ${hasTopGutter && styles.topGutter}`}
            split={orientation}
            dir="ltr"
            collapse={{ collapseDirection: 'right' }}
            resizerOptions={{
                grabberSize: '1rem',
            }}
            minSizes={minSize}
        >
            {children}
        </SplitPane>
    );
};

export default CollapsiblePane;
