export const labsKeys = {
    all: ["labs"] as const,
    tests: () => [...labsKeys.all, "tests"] as const,
    test: (id: number | string) => [...labsKeys.tests(), id] as const,
};
