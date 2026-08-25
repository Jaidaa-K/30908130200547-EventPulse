const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  test('should call the wrapped function with req, res, and next', async () => {
    const req = { body: { test: 'data' } };
    const res = {};
    const next = jest.fn();

    const controller = jest.fn();

    const wrapped = asyncHandler(controller);

    wrapped(req, res, next);

    expect(controller).toHaveBeenCalledWith(req, res, next);
  });

  test('should pass rejected errors to next()', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const error = new Error('Something went wrong');

    const controller = jest.fn().mockRejectedValue(error);

    const wrapped = asyncHandler(controller);

    wrapped(req, res, next);

    // Wait for the rejected Promise to reach .catch(next)
    await new Promise(setImmediate);

    expect(next).toHaveBeenCalledWith(error);
  });
});