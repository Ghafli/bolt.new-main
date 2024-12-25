import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './Slider.module.scss';
import { classNames } from '~/app/utils/classNames';

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    { min = 0, max = 100, step = 1, value, onChange, className },
    ref,
  ) => {
    const [position, setPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const updatePosition = useCallback(() => {
      const range = max - min;
      if (!range) return;

      const percent = ((value - min) / range) * 100;
      setPosition(percent);
    }, [max, min, value]);

    useEffect(() => {
      updatePosition();
    }, [updatePosition]);

    const handleInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        onChange(newValue);
      },
      [onChange],
    );

    const handleTrackClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!sliderRef.current || !trackRef.current) return;

        const sliderRect = sliderRef.current.getBoundingClientRect();
        const trackRect = trackRef.current.getBoundingClientRect();

        const clickX = event.clientX;
        const relativeX = clickX - trackRect.left;

        const trackWidth = trackRect.width;

        const ratio = relativeX / trackWidth;
        const newValue = min + (max - min) * ratio;

        // Snap to nearest step
        const snappedValue = Math.round(newValue / step) * step;

        // Ensure value is within bounds
        const clampedValue = Math.min(max, Math.max(min, snappedValue));

        onChange(clampedValue);
      },
      [max, min, onChange, step],
    );

    return (
      <div
        ref={ref}
        className={classNames(styles.slider, className)}
        onClick={handleTrackClick}
      >
        <div
          ref={trackRef}
          className={styles.track}
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${position}%, var(--color-bg-hover) ${position}%)`,
          }}
        >
          <div
            ref={sliderRef}
            className={styles.thumb}
            style={{
              left: `calc(${position}% - 8px)`,
            }}
          />
        </div>

        <input
          type="range"
          className={styles.input}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
        />
      </div>
    );
  },
);
