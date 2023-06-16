#!/bin/bash

for file in *.mp3
do
  if [[ $file != "static.mp3" ]]; then
    ffmpeg -i "$file" -i static.mp3 -filter_complex "[0:0][1:0]concat=n=2:v=0:a=1[out]" -map "[out]" "processed_${file}"
  fi
done

