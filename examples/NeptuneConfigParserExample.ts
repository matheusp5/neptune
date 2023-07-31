import NeptuneConfigParser from "../src/utils/NeptuneConfigParser";

const configParser = new NeptuneConfigParser('main')
console.log(configParser.parseConfiguration())
