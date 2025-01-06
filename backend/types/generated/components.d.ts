import type { Schema, Struct } from '@strapi/strapi';

export interface MenuDropdown extends Struct.ComponentSchema {
  collectionName: 'components_menu_dropdowns';
  info: {
    description: '';
    displayName: 'Dropdown';
    icon: 'arrowDown';
  };
  attributes: {
    sections: Schema.Attribute.Relation<'oneToMany', 'api::section.section'>;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface MenuLink extends Struct.ComponentSchema {
  collectionName: 'components_menu_links';
  info: {
    description: '';
    displayName: 'link';
    icon: 'link';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface MenuMenuButton extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_buttons';
  info: {
    displayName: 'MenuButton';
    icon: 'cursor';
  };
  attributes: {
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary']>;
    url: Schema.Attribute.String;
  };
}

export interface MenuMenuLink extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_links';
  info: {
    displayName: 'MenuLink';
    icon: 'link';
  };
  attributes: {
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PageBlockCallToActionBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_block_call_to_action_blocks';
  info: {
    description: '';
    displayName: 'CallToAction';
    icon: 'cursor';
  };
  attributes: {
    buttonLink: Schema.Attribute.String;
    buttonTitle: Schema.Attribute.String;
    description: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface PageBlockCarouselBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_block_carousel_blocks';
  info: {
    description: '';
    displayName: 'Carousel';
    icon: 'landscape';
  };
  attributes: {
    images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface PageBlockImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_block_image_blocks';
  info: {
    description: '';
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface PageBlockMapBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_block_map_blocks';
  info: {
    description: '';
    displayName: 'Map';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.String;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
  };
}

export interface PageBlockTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_block_text_blocks';
  info: {
    description: '';
    displayName: 'Text';
    icon: 'layer';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
  };
}

export interface PageBlockVideoBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_block_video_blocks';
  info: {
    description: '';
    displayName: 'Video';
    icon: 'television';
  };
  attributes: {
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'menu.dropdown': MenuDropdown;
      'menu.link': MenuLink;
      'menu.menu-button': MenuMenuButton;
      'menu.menu-link': MenuMenuLink;
      'page-block.call-to-action-block': PageBlockCallToActionBlock;
      'page-block.carousel-block': PageBlockCarouselBlock;
      'page-block.image-block': PageBlockImageBlock;
      'page-block.map-block': PageBlockMapBlock;
      'page-block.text-block': PageBlockTextBlock;
      'page-block.video-block': PageBlockVideoBlock;
    }
  }
}
