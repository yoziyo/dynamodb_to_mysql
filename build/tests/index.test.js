describe('메인 함수 호출 테스트', () => {
    test('파일 생성', () => {
        generatorConfigure();
        const configFileRead = readFileSync(configFilepath, 'utf-8');
        expect(JSON.parse(configFileRead)).toEqual(defaultConfig);
    });
});
//# sourceMappingURL=index.test.js.map