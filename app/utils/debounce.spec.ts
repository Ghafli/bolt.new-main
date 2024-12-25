import { debounce } from "./debounce";

jest.useFakeTimers();

describe("debounce", () => {
  it("should call the function after the specified delay", () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should only call the function once if called multiple times within the delay", () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });


    it("should pass the last arguments to the debounced function", () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn(1, "hello");
      debouncedFn(2, "world");


      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(2, "world")
    });

  it("should work with different delays", () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const debouncedFn1 = debounce(fn1, 50);
    const debouncedFn2 = debounce(fn2, 150);

    debouncedFn1();
    debouncedFn2();

    jest.advanceTimersByTime(50);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
    expect(fn2).toHaveBeenCalledTimes(1)
  });
});
