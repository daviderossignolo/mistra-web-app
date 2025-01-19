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

export interface ContactAction extends Struct.ComponentSchema {
  collectionName: 'components_contact_actions';
  info: {
    description: '';
    displayName: 'Action';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ContactHours extends Struct.ComponentSchema {
  collectionName: 'components_contact_hours';
  info: {
    description: '';
    displayName: 'hours';
  };
  attributes: {
    afternoonClosing: Schema.Attribute.Time;
    afternoonOpening: Schema.Attribute.Time;
    day: Schema.Attribute.Enumeration<
      [
        'Luned\u00EC',
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

export interface ContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_contact_infos';
  info: {
    displayName: 'info';
    icon: 'apps';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface ContactIntroduction extends Struct.ComponentSchema {
  collectionName: 'components_contact_introductions';
  info: {
    displayName: 'introduction';
    icon: 'filter';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface ContactMap extends Struct.ComponentSchema {
  collectionName: 'components_contact_maps';
  info: {
    displayName: 'map';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.String;
    cap: Schema.Attribute.String;
    city: Schema.Attribute.String;
    content: Schema.Attribute.Blocks;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    title: Schema.Attribute.String;
  };
}

export interface ContactOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_contact_opening_hours';
  info: {
    description: '';
    displayName: 'openingHours';
  };
  attributes: {
    description: Schema.Attribute.Text;
    hour: Schema.Attribute.Component<'contact.hours', true>;
    title: Schema.Attribute.String;
  };
}

export interface EventsImages extends Struct.ComponentSchema {
  collectionName: 'components_events_images';
  info: {
    displayName: 'images';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface EventsSectionBlock extends Struct.ComponentSchema {
  collectionName: 'components_events_section_blocks';
  info: {
    displayName: 'section_block';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    images: Schema.Attribute.Component<'events.images', true>;
    moving_banner: Schema.Attribute.String;
  };
}

export interface EventsSections extends Struct.ComponentSchema {
  collectionName: 'components_events_sections';
  info: {
    displayName: 'sections';
    icon: 'apps';
  };
  attributes: {
    section_block: Schema.Attribute.Component<'events.section-block', true>;
    title: Schema.Attribute.String;
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

export interface NewsPageSection extends Struct.ComponentSchema {
  collectionName: 'components_news_page_sections';
  info: {
    description: '';
    displayName: 'section';
    icon: 'apps';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    qrcode: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface UsefulLinksLinks extends Struct.ComponentSchema {
  collectionName: 'components_useful_links_links';
  info: {
    displayName: 'links';
  };
  attributes: {
    description: Schema.Attribute.Text;
    url: Schema.Attribute.String;
  };
}

export interface UsefulLinksLinksSection extends Struct.ComponentSchema {
  collectionName: 'components_useful_links_links_sections';
  info: {
    displayName: 'links-section';
    icon: 'apps';
  };
  attributes: {
    resource: Schema.Attribute.Component<'useful-links.video', true>;
    title: Schema.Attribute.String;
  };
}

export interface UsefulLinksVideo extends Struct.ComponentSchema {
  collectionName: 'components_useful_links_videos';
  info: {
    description: '';
    displayName: 'video';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    links: Schema.Attribute.Component<'useful-links.links', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.department': AboutDepartment;
      'about.member': AboutMember;
      'contact.action': ContactAction;
      'contact.hours': ContactHours;
      'contact.info': ContactInfo;
      'contact.introduction': ContactIntroduction;
      'contact.map': ContactMap;
      'contact.opening-hours': ContactOpeningHours;
      'events.images': EventsImages;
      'events.section-block': EventsSectionBlock;
      'events.sections': EventsSections;
      'header.content': HeaderContent;
      'infection-page.section': InfectionPageSection;
      'menu.dropdown': MenuDropdown;
      'menu.link': MenuLink;
      'menu.menu-button': MenuMenuButton;
      'menu.menu-link': MenuMenuLink;
      'news-page.section': NewsPageSection;
      'useful-links.links': UsefulLinksLinks;
      'useful-links.links-section': UsefulLinksLinksSection;
      'useful-links.video': UsefulLinksVideo;
    }
  }
}
