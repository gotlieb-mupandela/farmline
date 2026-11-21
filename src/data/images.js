// Product imagery. Files live in /public/images/<key>.jpg.
// The original Stitch exports (STITCH_SOURCES below) are private to the designer's Google
// account, so they can't be hot-linked: download them from Stitch and save them under these
// names. Until then <Img> shows a clay placeholder with a matching icon.
export const IMAGES = {
  butternut: '/images/butternut.jpg',
  tomatoes: '/images/tomatoes.jpg',
  onions: '/images/onions.jpg',
  spinach: '/images/spinach.jpg',
  maria: '/images/maria.jpg',
  thomas: '/images/thomas.jpg',
  routeMap: '/images/routeMap.jpg',
  farmerPhone: '/images/farmerPhone.jpg',
  bakkie: '/images/bakkie.jpg',
  coins: '/images/coins.jpg',
  hero: '/images/hero.jpg',
};

const base = 'https://lh3.googleusercontent.com/aida/';

export const STITCH_SOURCES = {
  butternut:
    base +
    'ALJJyrCGSMySyUf0MQ1YyM6wjEyEonxoJnnfcB9sJmRF4KPbNLBa31QMgchOVFNx3kScjzJqwF7SRiD3S8xJsNjxHzxE8UUl1qFF5HwjJNI0KV4KZZvUYQcJMm8F5RZ_fWs710l7lvu5eSdCx9dOjr5p_tBDLWpfmyDTH2noYYzG6ZqMyHNZtAtliVwCFPWD8WQOablauhnfBNFn6mj2QDm7V0RMVR21Zk1WmZeSa0Gq92Pk_7ZTxj8s-3xx',
  tomatoes:
    base +
    'ALJJyrAQfA97_bv8Ocp2Wvj95P8cFi__8JsOLQZWxpr1UYem0tefY1DhxWPHFMmnZT0rUeEn6f-hDY_qlGm1Zvas7_a-td5btm6g0Y3WwYRQPm48Zm5qh3Qe1sahkiOTysVTMNhTbfQsQvZIXGX02sfjws39Vo5nrU7Ghb8h_hX-glR6Z28BUTC-aBxfFnq5feObZJcwtCFs3BHthBPe6mdRvazHxax6-wwEaZSbpv0Of3bMNO5AgKy7TQ',
  onions:
    base +
    'ALJJyrBJxWV-3ufdISAT7VsgjebuwJ459f3RIZXwEzyruVjB1O49SwG_tEpCElHSvjcuVCotdu-295ItqR1Wld0kuFHBpKTPWS9wa2qLi1l6q9EaasMOwvpduVeaKS8qi9eEbdoFgyiRNM6JLeyAaX4GET1DM4X-r89f7LTVbhVxfme48ae5vTrnnUZgf4HnfN2YRNsS2J7rbmRCMBvxjSvx1BKUKMizPQo1iSWQjfDDk5YPiBvyFiY',
  spinach:
    base +
    'ALJJyrCpM0Jq1qSHGMhDfD1gs6G_NA2ja8lsyVbIsfHRJZ7Ic30L6T6wc1wcdkvsZD7iLC9GZ9uAdvzzRPtqUE2MHlOPMVvlNkt0TQe1IpqNq4ENOPXrjsGkP-CfQKB9Qhx5tWcXJtMtUrzGQu8qpUwEV3s4i5R-4OKX2iFnreDQTPvJAIpbpa9OmsSIYtvS1ZF_3GVkBxjToFHs4MQhSG09KQVx-9qbHCMrkA9GL0t6MKjQ5vmI1jcI',
  maria:
    base +
    'ALJJyrD4wQU4Y5JXByqOZ66oyzB0sKjQBrX_4f02O7US46chYuKRtKCPdf2_l14zQRuaLG3Gs01jL9dGJD8wGReOWs7HMp_CFCxtlm9maYLL8RDMfT1cinrgOnEnYqxw31Wdx9jDlHm3GWpmkva5K3l1qZbkHsfPFWWDa9_eMDpcJdW1sB9mZaGF4JbuEzrXnQo1iGo8IZoG7Ks2gH-RwLBmUWKjp5XpRxZUjNagU1dkBHp608K1nwc4',
  thomas:
    base +
    'ALJJyrBXnnGanNQa_b2I7y8IbvwNbx7H9Vu0pJgugqyW5UWDkqfRhGyqjcmwsXhNIyU-Ex7D08Z23eq5PiTjBWUHPmmsBFERU0QcL4EdGs35MJvFqI244ZaLV6SrpZjthDl7dQSn4EQ4nDm8bwxRJ7vqSI4WsOZJzljgOvlJ7FBWXsN-uzsfQsnIl-oRsfLryx63vBm_C9VjLOWpc0nQ0fpkqtCqiAZkV3M6ZVpS-fonRBYdKolHK5hj8A',
  routeMap:
    base +
    'ALJJyrC-8zaI69fCKNbAJZEobLxiVQ-ORafDG8HK19yBiv2yS_AbhCsRO6Vx7IHKVv2lVlkRfeWXCysfrE1QRN09gMjBs-ONE4ip_1vX7bSI7cwemn32wZjP21UP8T5PxNr1Nf4qTL_BtiokDDuJphgKegYVaPqToIhDlGUcqk4x2dS9JdTCZGT6uncnympm2wECyeRg3ISOvdL0swxStGpD5CZmwX-VxIn8PyM3D8LjDyZxFFrvAA',
  farmerPhone:
    base +
    'ALJJyrCQVpuTKuvh3NdtnKlArvuiCFE4eSduYklPOuOcl8uCMHPv-Tu4j0D0OctJ4wf-7Kyhj7ndc2TkXyqQ5wfVwMLJzAP6ARE6F87Kp1qgjTt9e5FkekgC_1u-eQRjlR3dHLWtLs5QzXEdWZdE-FNc3y2NAsonv-aFdtww4tQ8iyjaMu-k3DHSIutPR5zqSjKYd72bX6_bmr35Jg8kuwv05jvTMPcwXg_TiZY5E5S3W92lrzTyCFM9K52JN7M',
  bakkie:
    base +
    'ALJJyrDWhZvLLLD0oydkLnHzrK4OJFUl_Rc6NUUfleLElCURI05H74CCljfpsZrE_olmFgI_bCOQVbXjgMmJtgwH2vtIXYSkIMkFZwh0k8LHWJy1My_s_bwvqjlLulb7tTWvzZyySxcOAIm1hF72Yys-aqpWXuk38I2Bf6SxLQQg6iJDOdNrEHwWNzx1x8YyS9WChuZFx893qO2jgmxnQ66EKi4TYOtOwgQHOztAez_31y83VUGmhk0jPK_JvW2vPZTCXg',
  coins:
    base +
    'ALJJyrDeQEL_LQnjaUz0DrLN13pmi8fDFabsWWQiPijOSPoqgLsV_cp8Zw24J_NePp5kFg0DDjqUlq32HUH4jyU_ihk24XEqLB_8IRdzKG51-nmvGVu35Iw1NKpfs1eYvyXe_QoHQpuFTjFPKZWQgGUeewXebmvw6HzdVjbWjDsokCaIlTCni_gbZUec4DPXeoH1ufY327fRLTESjoS905eOS2VEx-TKY8dUvbRyIUYb0lzWMdagyLw4kqqOiw',
  hero:
    base +
    'ALJJyrAHCFgHcSWlYL7ICWF085BK5y8vSH_ltKD67TDFukHDn15Hk5hLMSliRRQwCHJGV40lx_Hg3UFzUe4PnQwI3C2dvOwgzsrKLd5nAORyjB--uBOVLXPXZTeEJPB_Om-04qNB17pNcBC_VoL-GveYP1ja_FXzRDcsFabzE_WHdoSGIw6-O024Blmu4-Xkd_mNeiz5JWWEBVDZ6JFx8XUfJPZnsbu-6V8CF7tqq5R5hgFeIYhHpn-KK5Em',
};
