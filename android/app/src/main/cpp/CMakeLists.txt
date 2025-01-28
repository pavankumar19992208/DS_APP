cmake_minimum_required(VERSION 3.10.2)

project(appmodules)

add_library(appmodules SHARED
    ../../../../src/main/jni/autolinking.cpp
    ../../../../src/main/jni/OnLoad.cpp
)

find_library(log-lib log)

target_link_libraries(appmodules ${log-lib})

set(CMAKE_CXX_STANDARD 17)  # Set C++ standard to 17
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set additional flags
add_compile_options(-DANDROID_STL=c++_shared -DANDROID_CPP_FEATURES=rtti exceptions)