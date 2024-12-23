// app/utils/debounce.spec.ts
import { debounce } from "./debounce";

describe("debounce", () => {
  jest.useFakeTimers();

    it("should call the function after the wait time", () => {
        const fn = jest.fn();
         const debounced = debounce(fn, 100);
         debounced();

    jest.advanceTimersByTime(100);
     expect(fn).toHaveBeenCalledTimes(1);
    });

   it("should call the function only once if called multiple times within the wait time", () => {
        const fn = jest.fn();
         const debounced = debounce(fn, 100);
           debounced();
            debounced();
            debounced();

        jest.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });
      it("should call the function after each wait time", () => {
        const fn = jest.fn();
         const debounced = debounce(fn, 100);
           debounced();

        jest.advanceTimersByTime(100);

       debounced();
        jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  it("should call the function with the latest arguments", () => {
     const fn = jest.fn();
         const debounced = debounce(fn, 100);
           debounced("first call");
          debounced("second call");
        jest.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledWith("second call");
  });
});
