if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/tarik/.gradle/caches/8.10.2/transforms/02dfef44a325c4b780258a54d06046ed/transformed/hermes-android-0.76.7-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/tarik/.gradle/caches/8.10.2/transforms/02dfef44a325c4b780258a54d06046ed/transformed/hermes-android-0.76.7-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

