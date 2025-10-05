'use client';

import { useRef, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useToggle } from '@/hooks/useToggle';
import { cn } from '@/utils/cn';

interface ExpandableProps {
  children: React.ReactNode;
  collapsedHeight?: number;
  className?: string;
  contentClassName?: string;
}

const Expandable: React.FC<ExpandableProps> = ({
  children,
  collapsedHeight = 120,
  className,
  contentClassName,
}) => {
  const [expanded, toggleExpanded] = useToggle();
  const [contentHeight, setContentHeight] = useState(collapsedHeight);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className={className}>
      <motion.div
        initial={false}
        animate={{ height: expanded ? contentHeight : collapsedHeight }}
        transition={{ duration: 0.1, ease: 'easeInOut' }}
        className={cn('relative overflow-hidden', contentClassName)}
      >
        <div ref={contentRef}>{children}</div>

        <AnimatePresence initial={false}>
          {!expanded && (
            <motion.div
              key='gradient'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
              className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none'
              aria-hidden='true'
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className='flex h-max gap-x-4 text-[15px] font-medium text-purple'>
        <button
          onClick={toggleExpanded}
          disabled={expanded}
          className='disabled:opacity-60 hover:underline'
          aria-label='Expand hidden content'
        >
          Expand
        </button>
        <button
          onClick={toggleExpanded}
          disabled={!expanded}
          className='disabled:opacity-60 hover:underline'
          aria-label='Hide open content'
        >
          Show Original
        </button>
      </div>
    </div>
  );
};

export default Expandable;
