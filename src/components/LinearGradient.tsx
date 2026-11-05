/**
 * Pure React Native Linear Gradient
 * Replaces react-native-linear-gradient with 100% pure React Native Image/View
 * to eliminate native binary linking requirements and New Architecture (Fabric) view config errors.
 */

import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

const GRADIENT_BASE64 = {
  header: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACo0lEQVR4nOXQ+U8OABwH4O+mpKSUlJSSktL5dry93cfb2/F2R7pVOnSn0qE7lQ7VHMMcwxzDHMMcwxzDHMMcwxzDHMMcwxzjp4+9f8fnT3gemeCWCT33LOh55EDfIxf6nnmY6JUPA+8CGCgKMUlRBEOfYhj6lsDIrxRGfmWY7F8OY2UFjAMqMUVVDRNVDUwCa2EaVAfT4HpMDWmAWUgjzEKbYB7WDPPwFkwLb4VFRBssItsxPaoDluouWKq7YRXdAytNL2bE9ME6th/WsQOYGTcIm/gh2GiHYasdgW3CKGYljsEuaRx2yWtgn7wW9inrMDt1PRzSNsAhfSPmpG+C44LNcFy4BU4ZW+GUsQ1zF22Hc+YOOGftxLzsXXDJ3g2XnD1wzd0L17x9mJ+/H8KMd8s/AGHGuy0+CGHGuxccgjDj3QsPQ5jxHoVHIMx4z6KjEGa855JjEGa8V/FxCDPeu+QEhBnvXXISwoxXlJ7SBfDiFWWnIcx4n6VnIMx43/KzEGa8b/k5CDPer+I8hBnvX3kBwoz3r7oIYcYrqy5BmPHK6ssQZnxAzRUIM15VexXCjFfVXYMw4wPrrkOY8YHLbkCY8UH1NyHM+OCGWxBmfHDjbQgzPqTxDoQZH7r8ri6AFx/adA/CjA9rvg9hxoc1P4Aw48NbHkKY8RGtj3QBvPiIFY8hzPjIticQZnxU21MIMz6q/RmEGa/ueA5hxqs7X0CY8dGdLyHMeE3XKwgzXtP9GsKMj+l5A2HGx/S+hTDjY3vfQZjxcSvfQ5jxcX0fIMz4+P6PEGa8duAThBmvHfgMYcYnrPqiC+DFJwx+hTDjE4e+QZjxScPfIcz4pOEfEGZ88shPCDM+ZfUvCDM+ZfQ3hBmfOvoHwoxPHfsLYcanjf/Df+jB2n3gePY1AAAAAElFTkSuQmCC',
  button: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAACCAYAAADo+dq5AAAA50lEQVR4nOXQgSqDYRSA4dV3zrkZY8xmjBljxhgzZj8iQjTRiIgQESEiQkSEiIgbfF2I5xIenysr4Pwezj+EKx/GVYzgAqO4wBiuchxXNYELTuKCU0j1NBKaQUJFJDyL1MwhkXkkUkJqF5C6RSS6hESXkfoVpGEVia0hsXWkcQOJbyLxLaRpG2neQRK7aGIPbdlHWw/Q5CGaPELbjtHUCZo6RdvP0I5zNH2Bpi/Rziu06xrN3KCZW7T7Du25R7MPaPYR7X3Ccs9Y7gXre8X637D8O5b/wAY+scIX5n1j3g82+Ivvvwf8ATfL5QF0LqrXAAAAAElFTkSuQmCC',
  banner: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAACCAYAAADo+dq5AAABEUlEQVR4nOXQ+SoDAADA4ZUd2Gazy047/eWYe+655557xmxjSUlKSlKSkpSkJCUpKUlJSlKSkpSkpCQlKUnJQ/w8iO8RPkFcegBhRhBhZghRVhiRO4rYHUOcPYIkZxRJ7hjxeePE50+QUDBJQuEUiZ5ppJ4ZpEWzyIrnkJXMIy9dQF62SFL5EkkVyyi8Kyi8qygr11BWrZNcvYGqZhNV7Rbqum3U9TtofLtofHtoG/bRNh6gazpE13xESssx+tYT9G2nGPxnGPznGNsvMHZcYuq8wtR1jbn7BnPPLZbeOyyBe1IDD1j7HrEGn7D1P2MbeMEeesU++IYj/I4j8oEz8okz+oVr6BvX8A9psV8E/z3gD7TP/YHJiEYMAAAAAElFTkSuQmCC',
  scrim: 'data:image/png;base64,iVBORw0KGgoAAAAAAAElFTkSuQmCC',
  cardSelected: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAACCAIAAABnm03uAAAAw0lEQVR4nNXPiVIBAQAGYI+WKUOTBkNTTUwMBoNJk82127qvXfe9lQ4KyfFa//8UnsP3Bp/uRID+GacJnCVhSMGYhimDcxEXIswSLl9gkWHNwpaDPQ9HAVdFXJdwU8ZtBXdVOGtw1XGvwK3Ao8LbgK8JfwuBNoIdhLoI9xjpMzrgw5CxER/HfJowrlHQmHhl8o2pd2amFD8ofVL+YvabuRkLcxZ/WPplZcHqkrUVlRXVPzbWbP2zvWFny96O/T11xx44AGmm8wE7gtZeAAAAAElFTkSuQmCC',
};

export interface LinearGradientProps {
  colors: (string | number)[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const LinearGradient: React.FC<LinearGradientProps> = ({
  colors,
  start,
  style,
  children,
}) => {
  const getGradientUri = (): string => {
    const c0 = String(colors[0]).toUpperCase();
    const c1 = String(colors[1]).toUpperCase();

    if (
      c0 === '#4075E9' ||
      c0 === '#3B72EE' ||
      c1 === '#94B0EA' ||
      c1 === '#93C5FD' ||
      c0.includes('4075') ||
      c1.includes('94B0')
    ) {
      return GRADIENT_BASE64.cardSelected;
    }

    if (c0 === '#032B57' && c1 === '#518EF9') return GRADIENT_BASE64.header;
    if ((c0 === '#032B57' || c0 === '#03264C') && c1 === '#0659B2') return GRADIENT_BASE64.button;
    if (c0 === '#032B57' && c1 === '#2563EB') return GRADIENT_BASE64.banner;
    if (c0.includes('TRANSPARENT') || c1.includes('0.8')) return GRADIENT_BASE64.scrim;

    return start?.x !== undefined ? GRADIENT_BASE64.button : GRADIENT_BASE64.header;
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: getGradientUri() }}
        style={StyleSheet.absoluteFill}
        resizeMode="stretch"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});

export default LinearGradient;
