
import { defineConfig } from 'vite'
import {getDependencieNames,getBaseNameOfHumpFormat,removeScope} from "package-tls";
import pkg from "./package.json";
import {dirname} from "path";
import {build} from "vite";


// 手动配置
const entry = 'src/index.ts';   // 输入（入口）文件
//所需构建的模块格式
const formatsForExcludeDep = ['es', 'umd'];  //要排除依赖包的模块格式
const formatsForIncludeDep = ['iife'];  //要包含依赖包的模块格式


// 自动配置
const pkgName = getBaseNameOfHumpFormat(pkg.name);  //驼峰格式的 pkg.name
const outDir = dirname(pkg.main || "dist");    //输出目录




/**
 * @type {import("vite").UserConfig}
 */
const config = {
    build:{
        lib: {
            name:pkgName, 
            entry: entry,
        },
        outDir:outDir,
        rollupOptions:{
            external:getDependencieNames(pkg),
        }
    }
};


/**
 * 导出最终的配置
 */
export default defineConfig((options)=>{
    const {mode} = options;


    switch (mode) {
        case "stage":{
            config.build.lib.formats = [...formatsForExcludeDep,...formatsForIncludeDep];
            config.build.rollupOptions.external = getDependencieNames(pkg,["peerDependencies"]);
            break;
        }
        default: {
            if (formatsForIncludeDep.length>0){
                const inlineConfig = JSON.parse(JSON.stringify(config));
                inlineConfig.configFile = false; // 防止死循环：循环调用此函数
                inlineConfig.build.emptyOutDir = false; // 不清空输出目录
                inlineConfig.build.lib.formats = formatsForIncludeDep;
                inlineConfig.build.rollupOptions.external = getDependencieNames(pkg,["peerDependencies"]);
                build(inlineConfig); //单独进行构建
            }
        }
    }

    return config;
})