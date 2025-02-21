#!/bin/bash

# 设置工作目录
cd /Users/jianguo/Desktop/nutpi/project/picgo-plugin-gitcodo

# 获取当前时间
current_hour=$(date +%H)

# 检查是否在8点到23点之间
if [ $current_hour -ge 8 ] && [ $current_hour -le 23 ]; then
    echo "=== 开始自动提交 $(date '+%Y-%m-%d %H:%M:%S') ==="
    
    # 检查是否有变更
    if [[ -n $(git status -s) ]]; then
        # 添加所有变更
        git add .
        
        # 提交变更
        git commit -m "自动提交: $(date '+%Y-%m-%d %H:%M:%S')"
        
        # 推送到远程仓库
        git push origin main
        
        echo "=== 提交完成 ==="
    else
        echo "=== 没有需要提交的变更 ==="
    fi
else
    echo "=== 当前时间不在工作时段（8:00-23:00）==="
fi