#!/usr/bin/env bash

APP_TEMPLATE_DIR="generators/app/templates"
APP_TEMPLATE_STATIC_DIR="${APP_TEMPLATE_DIR}/static"
SCAFFOLD_TEMPLATE_DIR="generators/g-scaffold/templates"
HARDLINKS_DIR="../hardlinks-generator-goqoo"

mkdir -p ${HARDLINKS_DIR}/.goqoo
mkdir -p ${HARDLINKS_DIR}/config

sed -e 's/<%= projectName %>/my-project/' ${APP_TEMPLATE_DIR}/package.json > ${HARDLINKS_DIR}/package.json
cp ${APP_TEMPLATE_DIR}/gitignore ${HARDLINKS_DIR}/.gitignore

ln -f ${APP_TEMPLATE_STATIC_DIR}/.eslintrc.yml ${HARDLINKS_DIR}
ln -f ${APP_TEMPLATE_STATIC_DIR}/.prettierrc.yml ${HARDLINKS_DIR}

ln -f ${APP_TEMPLATE_STATIC_DIR}/.goqoo/.gitkeep ${HARDLINKS_DIR}/.goqoo
ln -f ${APP_TEMPLATE_STATIC_DIR}/.goqoo/webpack.config.base.js ${HARDLINKS_DIR}/.goqoo
ln -f ${APP_TEMPLATE_STATIC_DIR}/.goqoo/dropbox.js ${HARDLINKS_DIR}/.goqoo

ln -f ${APP_TEMPLATE_STATIC_DIR}/config/sample.env ${HARDLINKS_DIR}/config
ln -f ${APP_TEMPLATE_STATIC_DIR}/config/webpack.config.goqoo.js ${HARDLINKS_DIR}/config

GOQOO_CONFIG="${HARDLINKS_DIR}/config/goqoo.config.yml"
echo "apps:" > ${GOQOO_CONFIG}
echo "  - scaffold" >> ${GOQOO_CONFIG}
echo "useDropbox: false" >> ${GOQOO_CONFIG}

APP_DIR="${HARDLINKS_DIR}/apps/scaffold"
mkdir -p ${APP_DIR}

ln -f ${SCAFFOLD_TEMPLATE_DIR}/scaffold-detail.js ${APP_DIR}
ln -f ${SCAFFOLD_TEMPLATE_DIR}/scaffold-index.js ${APP_DIR}
ln -f ${SCAFFOLD_TEMPLATE_DIR}/scaffold-submit.js ${APP_DIR}
ln -f ${SCAFFOLD_TEMPLATE_DIR}/customize.js ${APP_DIR}
ln -f ${SCAFFOLD_TEMPLATE_DIR}/customize.html ${APP_DIR}
ln -f ${SCAFFOLD_TEMPLATE_DIR}/customize.scss ${APP_DIR}
sed -e 's/<%= appName %>/scaffold/' ${SCAFFOLD_TEMPLATE_DIR}/scaffold.js > ${APP_DIR}/scaffold.js

git init ${HARDLINKS_DIR}
