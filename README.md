# MarkethPlace

## Dependencias de sistema

```
npm       [v 12.16.1]
ganache   [v 6.9.1] (o superiro)
``` 

## Configuración
Generar un mnemónico para el proyecto.
`https://iancoleman.io/bip39/`
Seleccionar:
1. Número de palabras
2. `ETH` en el lugar de `coin`
3. Dar click en `GENERATE`
4. copiar tu mnemónico en el campo `BIP39 Mnemonic`
5. Guardar el mnemónico copiado en el archivo .secret en la raíz del proyecto.

NOTA: Las palabras que aparecen que en el campo `BIP39 Mnemonic`, son las que se copian en un archivo .secret

## Instalar las dependencias del proyecto
` npm install`

## Lanzar el proyecto


1. Lanzar el blockchain local:
`npx ganache-cli`

Opcionalmente usar el script
https://github.com/ccolorado/eth-utils/blob/master/ganache-cli-wrapper

2. Lanzar el servidor web:
`npx webpack-dev-server`

3. navegar a http://localhost:8080

