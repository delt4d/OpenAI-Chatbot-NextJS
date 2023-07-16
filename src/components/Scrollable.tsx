import { cn } from '@/lib/utils';
import { FC, useRef, useState, useEffect, MouseEvent, HTMLAttributes } from 'react';

interface ScrollableProps extends HTMLAttributes<HTMLDivElement> {
    scrollX: 'scroll' | 'hidden' | 'auto'
    scrollY: 'scroll' | 'hidden' | 'auto'
}

const Scrollable: FC<ScrollableProps> = ({ className, children, scrollX: overflowX, scrollY: overflowY, ...props }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPosition, setDragStartPosition] = useState([0, 0]);
    const [scrollStartPosition, setScrollStartPosition] = useState([0, 0]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    }

    const handleMouseHover = () => {
        setIsDragging(true);
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = event.clientX - dragStartPosition[0];
        const deltaY = event.clientY - dragStartPosition[1];
        event.currentTarget.scrollLeft = scrollStartPosition[0] - deltaX;
        event.currentTarget.scrollTop = scrollStartPosition[1] - deltaY;
    };

    const handleMouseDown = (event: MouseEvent) => {
        setIsDragging(true);
        setDragStartPosition([event.clientX, event.clientY]);
        setScrollStartPosition([event.currentTarget.scrollLeft, event.currentTarget.scrollTop]);
    };

    return (
        <div
            {...props}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseHover}
            onMouseDown={handleMouseDown}
            className={cn(`overflow-x-${overflowX}`, `overflow-y-${overflowY}`, className)}
        >
            {children}
        </div>
    );
};

export default Scrollable;
