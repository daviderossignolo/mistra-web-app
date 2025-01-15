import type { Schema, Struct } from '@strapi/strapi';

export interface AboutDepartment extends Struct.ComponentSchema {
  collectionName: 'components_about_departments';
  info: {
    displayName: 'department';
    icon: 'house';
  };
  attributes: {
    team_member: Schema.Attribute.Component<'about.member', true>;
    title: Schema.Attribute.String;
  };
}

export interface AboutMember extends Struct.ComponentSchema {
  collectionName: 'components_about_members';
  info: {
    displayName: 'member';
    icon: 'user';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    profession: Schema.Attribute.String;
  };
}

export interface HeaderContent extends Struct.ComponentSchema {
  collectionName: 'components_header_contents';
  info: {
    displayName: 'content';
    icon: 'apps';
  };
  attributes: {
    main_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    text_content: Schema.Attribute.RichText;
  };
}

export interface InfectionPageSection extends Struct.ComponentSchema {
  collectionName: 'components_infection_page_sections';
  info: {
    displayName: 'section';
    icon: 'bulletList';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

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
    cap: Schema.Attribute.String;
    city: Schema.Attribute.String;
    description: Schema.Attribute.Blocks;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
  };
}

export interface PageBlockOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_page_block_opening_hours';
  info: {
    description: '';
    displayName: 'OpeningHours';
    icon: 'clock';
  };
  attributes: {
    hours: Schema.Attribute.Component<'page-block.orari', true>;
    title: Schema.Attribute.String;
  };
}

export interface PageBlockOrari extends Struct.ComponentSchema {
  collectionName: 'components_page_block_oraris';
  info: {
    displayName: 'Orari';
    icon: 'clock';
  };
  attributes: {
    afternoonClosing: Schema.Attribute.Time;
    afternoonOpening: Schema.Attribute.Time;
    Day: Schema.Attribute.Enumeration<
      [
        'Lunedi',
        'Marted\u00EC',
        'Mercoled\u00EC',
        'Gioved\u00EC',
        'Venerd\u00EC',
        'Sabato',
        'Domenica',
      ]
    >;
    morningClosing: Schema.Attribute.Time;
    morningOpening: Schema.Attribute.Time;
    note: Schema.Attribute.String;
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
      'about.department': AboutDepartment;
      'about.member': AboutMember;
      'header.content': HeaderContent;
      'infection-page.section': InfectionPageSection;
      'menu.dropdown': MenuDropdown;
      'menu.link': MenuLink;
      'menu.menu-button': MenuMenuButton;
      'menu.menu-link': MenuMenuLink;
      'page-block.call-to-action-block': PageBlockCallToActionBlock;
      'page-block.carousel-block': PageBlockCarouselBlock;
      'page-block.image-block': PageBlockImageBlock;
      'page-block.map-block': PageBlockMapBlock;
      'page-block.opening-hours': PageBlockOpeningHours;
      'page-block.orari': PageBlockOrari;
      'page-block.text-block': PageBlockTextBlock;
      'page-block.video-block': PageBlockVideoBlock;
    }
  }
}
