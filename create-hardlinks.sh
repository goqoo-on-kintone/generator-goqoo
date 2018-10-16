#!/usr/bin/env bash

TEMPLATE_DIR="generators/app/templates"
TEMPLATE_STATIC_DIR="${TEMPLATE_DIR}/static"
HARDLINKS_DIR="../hardlinks-generator-goqoo"

mkdir -p ${HARDLINKS_DIR}/.goqoo
mkdir -p ${HARDLINKS_DIR}/apps
mkdir -p ${HARDLINKS_DIR}/config

sed -e 's/<%= projectName %>/my-project/' ${TEMPLATE_DIR}/package.json > ${HARDLINKS_DIR}/package.json
cp ${TEMPLATE_DIR}/gitignore ${HARDLINKS_DIR}/.gitignore

ln -f ${TEMPLATE_STATIC_DIR}/.eslintrc.yml ${HARDLINKS_DIR}
ln -f ${TEMPLATE_STATIC_DIR}/.prettierrc.yml ${HARDLINKS_DIR}

ln -f ${TEMPLATE_STATIC_DIR}/.goqoo/.gitkeep ${HARDLINKS_DIR}/.goqoo
ln -f ${TEMPLATE_STATIC_DIR}/.goqoo/webpack.config.base.js ${HARDLINKS_DIR}/.goqoo
ln -f ${TEMPLATE_STATIC_DIR}/.goqoo/dropbox.js ${HARDLINKS_DIR}/.goqoo

ln -f ${TEMPLATE_STATIC_DIR}/config/sample.env ${HARDLINKS_DIR}/config
ln -f ${TEMPLATE_STATIC_DIR}/config/webpack.config.goqoo.js ${HARDLINKS_DIR}/config
cp ${TEMPLATE_STATIC_DIR}/config/.env ${HARDLINKS_DIR}/config
cp ${TEMPLATE_STATIC_DIR}/config/goqoo.config.yml ${HARDLINKS_DIR}/config

git init ${HARDLINKS_DIR}
