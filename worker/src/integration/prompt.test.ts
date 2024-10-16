import { stringToJson } from "./prompt"

describe('stringToJson', () => {
    it('should ', () => {
        let output = '```json'
        output += '['
        output += '    "Expansão Corporativa",'
        output += '    "Aplicação Prática",'
        output += '    "Credenciais",'
        output += '    "Negação",'
        output += '    "Networking"'
        output += ']'
        output += '```'

        const expectedResult = [
            "Expansão Corporativa",
            "Aplicação Prática",
            "Credenciais",
            "Negação",
            "Networking"
        ]

        expect(stringToJson(output)).toEqual({ hasJson: true, object: expectedResult });
    })
})
