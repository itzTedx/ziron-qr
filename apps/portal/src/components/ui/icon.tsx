"use client";

import * as React from "react";

import {
  type HTMLMotionProps,
  type LegacyAnimationControls,
  motion,
  type SVGMotionProps,
  type UseInViewOptions,
  useAnimation,
  type Variants,
} from "motion/react";

import { cn } from "@ziron/utils";

import { useIsInView } from "@/hooks/is-in-view";

import { Slot, WithAsChild } from "./slot";

const staticAnimations = {
  path: {
    initial: { pathLength: 1 },
    animate: {
      pathLength: [0.05, 1],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  } as Variants,
  "path-loop": {
    initial: { pathLength: 1 },
    animate: {
      pathLength: [1, 0.05, 1],
      transition: {
        duration: 1.6,
        ease: "easeInOut",
      },
    },
  } as Variants,
} as const;

type StaticAnimations = keyof typeof staticAnimations;
type TriggerProp<T = string> = boolean | StaticAnimations | T;
type Trigger = TriggerProp<string>;

type AnimateIconContextValue = {
  controls: LegacyAnimationControls | undefined;
  animation: StaticAnimations | string;
  loop: boolean;
  loopDelay: number;
  active: boolean;
  animate?: Trigger;
  initialOnAnimateEnd?: boolean;
  completeOnStop?: boolean;
  persistOnAnimateEnd?: boolean;
  delay?: number;
};

type DefaultIconProps<T = string> = {
  animate?: TriggerProp<T>;
  animateOnHover?: TriggerProp<T>;
  animateOnTap?: TriggerProp<T>;
  animateOnView?: TriggerProp<T>;
  animateOnViewMargin?: UseInViewOptions["margin"];
  animateOnViewOnce?: boolean;
  animation?: T | StaticAnimations;
  loop?: boolean;
  loopDelay?: number;
  initialOnAnimateEnd?: boolean;
  completeOnStop?: boolean;
  persistOnAnimateEnd?: boolean;
  delay?: number;
};

type AnimateIconProps<T = string> = WithAsChild<
  HTMLMotionProps<"span"> &
    DefaultIconProps<T> & {
      children: React.ReactNode;
      asChild?: boolean;
    }
>;

type IconProps<T> = DefaultIconProps<T> &
  Omit<SVGMotionProps<SVGSVGElement>, "animate"> & {
    size?: number;
  };

type IconWrapperProps<T> = IconProps<T> & {
  icon: React.ComponentType<IconProps<T>>;
};

const AnimateIconContext = React.createContext<AnimateIconContextValue | null>(null);

function useAnimateIconContext() {
  const context = React.useContext(AnimateIconContext);
  if (!context)
    return {
      controls: undefined,
      animation: "default",
      loop: undefined,
      loopDelay: undefined,
      active: undefined,
      animate: undefined,
      initialOnAnimateEnd: undefined,
      completeOnStop: undefined,
      persistOnAnimateEnd: undefined,
      delay: undefined,
    };
  return context;
}

function composeEventHandlers<E extends React.SyntheticEvent<unknown>>(
  theirs?: (event: E) => void,
  ours?: (event: E) => void
) {
  return (event: E) => {
    theirs?.(event);
    ours?.(event);
  };
}

// biome-ignore lint/suspicious/noExplicitAny: it's a valid type
type AnyProps = Record<string, any>;

function AnimateIcon({
  asChild = false,
  animate = false,
  animateOnHover = false,
  animateOnTap = false,
  animateOnView = false,
  animateOnViewMargin = "0px",
  animateOnViewOnce = true,
  animation = "default",
  loop = false,
  loopDelay = 0,
  initialOnAnimateEnd = false,
  completeOnStop = false,
  persistOnAnimateEnd = false,
  delay = 0,
  children,
  ...props
}: AnimateIconProps) {
  const controls = useAnimation();

  const [localAnimate, setLocalAnimate] = React.useState<boolean>(() => {
    if (animate === undefined || animate === false) return false;
    return delay <= 0;
  });
  const [currentAnimation, setCurrentAnimation] = React.useState<string | StaticAnimations>(
    typeof animate === "string" ? animate : animation
  );
  const [status, setStatus] = React.useState<"initial" | "animate">("initial");

  const delayRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopDelayRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimateInProgressRef = React.useRef<boolean>(false);
  const animateEndPromiseRef = React.useRef<Promise<void> | null>(null);
  const resolveAnimateEndRef = React.useRef<(() => void) | null>(null);
  const activeRef = React.useRef<boolean>(localAnimate);

  const runGenRef = React.useRef(0);
  const cancelledRef = React.useRef(false);

  const bumpGeneration = React.useCallback(() => {
    runGenRef.current++;
  }, []);

  const startAnimation = React.useCallback(
    (trigger: TriggerProp) => {
      const next = typeof trigger === "string" ? trigger : animation;
      bumpGeneration();
      if (delayRef.current) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
      setCurrentAnimation(next);
      if (delay > 0) {
        setLocalAnimate(false);
        delayRef.current = setTimeout(() => {
          setLocalAnimate(true);
        }, delay);
      } else {
        setLocalAnimate(true);
      }
    },
    [animation, delay, bumpGeneration]
  );

  const stopAnimation = React.useCallback(() => {
    bumpGeneration();
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    if (loopDelayRef.current) {
      clearTimeout(loopDelayRef.current);
      loopDelayRef.current = null;
    }
    setLocalAnimate(false);
  }, [bumpGeneration]);

  React.useEffect(() => {
    activeRef.current = localAnimate;
  }, [localAnimate]);

  React.useEffect(() => {
    if (animate === undefined) return;
    setCurrentAnimation(typeof animate === "string" ? animate : animation);
    if (animate) startAnimation(animate as TriggerProp);
    else stopAnimation();
  }, [animate, animation, startAnimation, stopAnimation]);

  React.useEffect(() => {
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
      if (loopDelayRef.current) clearTimeout(loopDelayRef.current);
    };
  }, []);

  const viewOuterRef = React.useRef<HTMLElement>(null);
  const { ref: inViewRef, isInView } = useIsInView(viewOuterRef, {
    inView: !!animateOnView,
    inViewOnce: animateOnViewOnce,
    inViewMargin: animateOnViewMargin,
  });

  const startAnim = React.useCallback(
    async (anim: "initial" | "animate", method: "start" | "set" = "start") => {
      try {
        await controls[method](anim);
        setStatus(anim);
      } catch {
        return;
      }
    },
    [controls]
  );

  React.useEffect(() => {
    if (!animateOnView) return;
    if (isInView) startAnimation(animateOnView);
    else stopAnimation();
  }, [isInView, animateOnView, startAnimation, stopAnimation]);

  React.useEffect(() => {
    const gen = ++runGenRef.current;
    cancelledRef.current = false;

    async function run() {
      if (cancelledRef.current || gen !== runGenRef.current) {
        await startAnim("initial");
        return;
      }

      if (!localAnimate) {
        if (completeOnStop && isAnimateInProgressRef.current && animateEndPromiseRef.current) {
          try {
            await animateEndPromiseRef.current;
          } catch {
            // noop
          }
        }
        if (!persistOnAnimateEnd) {
          if (cancelledRef.current || gen !== runGenRef.current) {
            await startAnim("initial");
            return;
          }
          await startAnim("initial");
        }
        return;
      }

      if (loop) {
        if (cancelledRef.current || gen !== runGenRef.current) {
          await startAnim("initial");
          return;
        }
        await startAnim("initial", "set");
      }

      isAnimateInProgressRef.current = true;
      animateEndPromiseRef.current = new Promise<void>((resolve) => {
        resolveAnimateEndRef.current = resolve;
      });

      if (cancelledRef.current || gen !== runGenRef.current) {
        isAnimateInProgressRef.current = false;
        resolveAnimateEndRef.current?.();
        resolveAnimateEndRef.current = null;
        animateEndPromiseRef.current = null;
        await startAnim("initial");
        return;
      }

      await startAnim("animate");

      if (cancelledRef.current || gen !== runGenRef.current) {
        isAnimateInProgressRef.current = false;
        resolveAnimateEndRef.current?.();
        resolveAnimateEndRef.current = null;
        animateEndPromiseRef.current = null;
        await startAnim("initial");
        return;
      }

      isAnimateInProgressRef.current = false;
      resolveAnimateEndRef.current?.();
      resolveAnimateEndRef.current = null;
      animateEndPromiseRef.current = null;

      if (initialOnAnimateEnd) {
        if (cancelledRef.current || gen !== runGenRef.current) {
          await startAnim("initial");
          return;
        }
        await startAnim("initial", "set");
      }

      if (loop) {
        if (loopDelay > 0) {
          await new Promise<void>((resolve) => {
            loopDelayRef.current = setTimeout(() => {
              loopDelayRef.current = null;
              resolve();
            }, loopDelay);
          });

          if (cancelledRef.current || gen !== runGenRef.current) {
            await startAnim("initial");
            return;
          }
          if (!activeRef.current) {
            if (status !== "initial" && !persistOnAnimateEnd) await startAnim("initial");
            return;
          }
        } else {
          if (!activeRef.current) {
            if (status !== "initial" && !persistOnAnimateEnd) await startAnim("initial");
            return;
          }
        }
        if (cancelledRef.current || gen !== runGenRef.current) {
          await startAnim("initial");
          return;
        }
        await run();
      }
    }

    void run();

    return () => {
      cancelledRef.current = true;
      if (delayRef.current) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
      if (loopDelayRef.current) {
        clearTimeout(loopDelayRef.current);
        loopDelayRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAnimate, completeOnStop, initialOnAnimateEnd, loop, loopDelay, persistOnAnimateEnd, startAnim, status]);

  const childProps = (React.isValidElement(children) ? (children as React.ReactElement).props : {}) as AnyProps;

  const handleMouseEnter = React.useCallback(
    composeEventHandlers<React.MouseEvent<HTMLElement>>(childProps.onMouseEnter, () => {
      if (animateOnHover) startAnimation(animateOnHover);
    }),
    []
  );

  const handleMouseLeave = React.useCallback(
    composeEventHandlers<React.MouseEvent<HTMLElement>>(childProps.onMouseLeave, () => {
      if (animateOnHover || animateOnTap) stopAnimation();
    }),
    []
  );

  const handlePointerDown = React.useCallback(
    composeEventHandlers<React.PointerEvent<HTMLElement>>(childProps.onPointerDown, () => {
      if (animateOnTap) startAnimation(animateOnTap);
    }),
    []
  );

  const handlePointerUp = React.useCallback(
    composeEventHandlers<React.PointerEvent<HTMLElement>>(childProps.onPointerUp, () => {
      if (animateOnTap) stopAnimation();
    }),
    []
  );

  const contextValue = React.useMemo<AnimateIconContextValue>(
    () => ({
      controls,
      animation: currentAnimation,
      loop,
      loopDelay,
      active: localAnimate,
      animate,
      initialOnAnimateEnd,
      completeOnStop,
      persistOnAnimateEnd,
      delay,
    }),
    [
      controls,
      currentAnimation,
      loop,
      loopDelay,
      localAnimate,
      animate,
      initialOnAnimateEnd,
      completeOnStop,
      persistOnAnimateEnd,
      delay,
    ]
  );

  const content = React.useMemo(
    () =>
      asChild ? (
        <Slot
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          ref={inViewRef}
          {...props}
        >
          {children}
        </Slot>
      ) : (
        <motion.span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          ref={inViewRef}
          {...props}
        >
          {children}
        </motion.span>
      ),
    [asChild, handleMouseEnter, handleMouseLeave, handlePointerDown, handlePointerUp, inViewRef, children, props]
  );

  return <AnimateIconContext.Provider value={contextValue}>{content}</AnimateIconContext.Provider>;
}

const pathClassName = "[&_[stroke-dasharray='1px_1px']]:![stroke-dasharray:1px_0px]";

const IconWrapper = React.memo(function IconWrapper<T extends string>({
  size = 28,
  animation: animationProp,
  animate,
  animateOnHover,
  animateOnTap,
  animateOnView,
  animateOnViewMargin,
  animateOnViewOnce,
  icon: IconComponent,
  loop,
  loopDelay,
  persistOnAnimateEnd,
  initialOnAnimateEnd,
  delay,
  completeOnStop,
  className,
  ...props
}: IconWrapperProps<T>) {
  const context = React.useContext(AnimateIconContext);

  // Compute all values at the top to avoid conditional hooks
  const parentAnimation = context?.animation;
  const parentLoop = context?.loop;
  const parentLoopDelay = context?.loopDelay;
  const parentActive = context?.active;
  const parentAnimate = context?.animate;
  const parentPersistOnAnimateEnd = context?.persistOnAnimateEnd;
  const parentInitialOnAnimateEnd = context?.initialOnAnimateEnd;
  const parentDelay = context?.delay;
  const parentCompleteOnStop = context?.completeOnStop;
  const controls = context?.controls;

  const hasOverrides =
    context &&
    (animate !== undefined ||
      animateOnHover !== undefined ||
      animateOnTap !== undefined ||
      animateOnView !== undefined ||
      loop !== undefined ||
      loopDelay !== undefined ||
      initialOnAnimateEnd !== undefined ||
      persistOnAnimateEnd !== undefined ||
      delay !== undefined ||
      completeOnStop !== undefined);

  const hasAnimationProps =
    animate !== undefined ||
    animateOnHover !== undefined ||
    animateOnTap !== undefined ||
    animateOnView !== undefined ||
    animationProp !== undefined;

  // Compute animation values
  const finalAnimation = context ? (animationProp ?? parentAnimation) : animationProp;
  const inheritedAnimate: Trigger = context && parentActive ? (animationProp ?? parentAnimation ?? "default") : false;
  const finalAnimate: Trigger = (animate ?? (context ? parentAnimate : undefined) ?? inheritedAnimate) as Trigger;
  const animationToUse = context ? (animationProp ?? parentAnimation) : animationProp;

  // Memoize className computation
  const iconClassName = React.useMemo(
    () => cn(className, (finalAnimation === "path" || finalAnimation === "path-loop") && pathClassName),
    [className, finalAnimation]
  );

  const iconClassNameWithAnimation = React.useMemo(
    () => cn(className, (animationProp === "path" || animationProp === "path-loop") && pathClassName),
    [className, animationProp]
  );

  const iconClassNameWithAnimationToUse = React.useMemo(
    () => cn(className, (animationToUse === "path" || animationToUse === "path-loop") && pathClassName),
    [className, animationToUse]
  );

  // Memoize context value
  const contextValue = React.useMemo<AnimateIconContextValue | null>(
    () =>
      context && controls && animationToUse
        ? {
            controls,
            animation: animationToUse,
            loop: parentLoop ?? false,
            loopDelay: parentLoopDelay ?? 0,
            active: parentActive ?? false,
            animate: parentAnimate,
            initialOnAnimateEnd: parentInitialOnAnimateEnd ?? false,
            delay: parentDelay ?? 0,
            completeOnStop: parentCompleteOnStop ?? false,
            persistOnAnimateEnd: parentPersistOnAnimateEnd ?? false,
          }
        : null,
    [
      context,
      controls,
      animationToUse,
      parentLoop,
      parentLoopDelay,
      parentActive,
      parentAnimate,
      parentInitialOnAnimateEnd,
      parentDelay,
      parentCompleteOnStop,
      parentPersistOnAnimateEnd,
    ]
  );

  // Render logic
  if (context && hasOverrides) {
    return (
      <AnimateIcon
        animate={finalAnimate}
        animateOnHover={animateOnHover}
        animateOnTap={animateOnTap}
        animateOnView={animateOnView}
        animateOnViewMargin={animateOnViewMargin}
        animateOnViewOnce={animateOnViewOnce}
        animation={finalAnimation}
        asChild
        completeOnStop={completeOnStop ?? parentCompleteOnStop}
        delay={delay ?? parentDelay}
        initialOnAnimateEnd={initialOnAnimateEnd ?? parentInitialOnAnimateEnd}
        loop={loop ?? parentLoop}
        loopDelay={loopDelay ?? parentLoopDelay}
        persistOnAnimateEnd={persistOnAnimateEnd ?? parentPersistOnAnimateEnd}
      >
        <IconComponent className={iconClassName} size={size} {...props} />
      </AnimateIcon>
    );
  }

  if (context && contextValue) {
    return (
      <AnimateIconContext.Provider value={contextValue}>
        <IconComponent className={iconClassNameWithAnimationToUse} size={size} {...props} />
      </AnimateIconContext.Provider>
    );
  }

  if (hasAnimationProps) {
    return (
      <AnimateIcon
        animate={animate}
        animateOnHover={animateOnHover}
        animateOnTap={animateOnTap}
        animateOnView={animateOnView}
        animateOnViewMargin={animateOnViewMargin}
        animateOnViewOnce={animateOnViewOnce}
        animation={animationProp}
        asChild
        completeOnStop={completeOnStop}
        delay={delay}
        loop={loop}
        loopDelay={loopDelay}
      >
        <IconComponent className={iconClassNameWithAnimation} size={size} {...props} />
      </AnimateIcon>
    );
  }

  return <IconComponent className={iconClassNameWithAnimation} size={size} {...props} />;
}) as <T extends string>(props: IconWrapperProps<T>) => React.ReactElement;

function getVariants<V extends { default: T; [key: string]: T }, T extends Record<string, Variants>>(animations: V): T {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { animation: animationType } = useAnimateIconContext();

  let result: T;

  if (animationType in staticAnimations) {
    const variant = staticAnimations[animationType as StaticAnimations];
    result = {} as T;
    for (const key in animations.default) {
      if ((animationType === "path" || animationType === "path-loop") && key.includes("group")) continue;
      result[key] = variant as T[Extract<keyof T, string>];
    }
  } else {
    result = (animations[animationType as keyof V] as T) ?? animations.default;
  }

  return result;
}

export {
  pathClassName,
  staticAnimations,
  AnimateIcon,
  IconWrapper,
  useAnimateIconContext,
  getVariants,
  type IconProps,
  type IconWrapperProps,
  type AnimateIconProps,
  type AnimateIconContextValue,
};
